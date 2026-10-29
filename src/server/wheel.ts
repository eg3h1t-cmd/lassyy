"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomInt } from "node:crypto";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { checkRateLimitAsync } from "@/lib/rate-limit";
import { wheelConfigSchema, defaultWheelConfig, type WheelConfig } from "@/lib/validations/wheel";
import { recordAuditEvent } from "@/server/audit";
import { canCreateCampaign, canRecordInteraction, subscriptionsEnforced } from "@/server/subscriptions";
import { hasModuleAccess } from "@/server/module-access";

const createCampaignSchema = z.object({
  storeId: z.string().uuid(),
  config: wheelConfigSchema,
  status: z.enum(["draft", "active", "paused", "archived"]).default("draft"),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
});

function generateCouponCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "PROMO-";
  for (let i = 0; i < 8; i++) code += alphabet[randomInt(0, alphabet.length)];
  return code;
}

export async function createWheelCampaignAction(input: unknown) {
  const parsed = createCampaignSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Geçersiz giriş" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Yetkisiz işlem" };

  const { storeId, config, status, startsAt, endsAt } = parsed.data;

  if (!(await hasModuleAccess(storeId, "sans_carki"))) {
    return { ok: false as const, error: "Bu modül aktif değil. Önce satın alın." };
  }

  if (subscriptionsEnforced()) {
    const limit = await canCreateCampaign(storeId);
    if (!limit.allowed) {
      return { ok: false as const, error: "Mevcut planınızın kampanya limitine ulaştınız. Planınızı yükseltin." };
    }
  }

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      store_id: storeId,
      module_id: "discount-spin-wheel",
      name: config.title,
      status,
      starts_at: startsAt ?? null,
      ends_at: endsAt ?? null,
      config,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/dashboard/wheel");
  return { ok: true as const, campaignId: data.id };
}

export async function trackWheelImpressionAction(campaignId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, store_id")
    .eq("id", campaignId)
    .maybeSingle();
  if (!campaign) return { ok: false as const };
  if (!(await hasModuleAccess(campaign.store_id, "sans_carki"))) return { ok: false as const };

  if (!(await canRecordInteraction(campaign.store_id))) return { ok: false as const };

  const service = createSupabaseServiceClient();
  const client = service ?? supabase;
  await client.from("analytics_events").insert({
    store_id: campaign.store_id,
    module_id: "discount-spin-wheel",
    campaign_id: campaign.id,
    event_type: "widget_impression",
    payload: {},
  });
  return { ok: true as const };
}

const saveSettingsSchema = z.object({
  storeId: z.string().uuid(),
  config: wheelConfigSchema,
  status: z.enum(["draft", "active", "paused", "archived"]).default("draft"),
});

export async function getWheelSettings(storeId: string): Promise<{
  config: WheelConfig;
  campaignId: string | null;
  status: string;
}> {
  const supabase = await createSupabaseServerClient();
  const [{ data: moduleRow }, { data: campaign }] = await Promise.all([
    supabase
      .from("store_modules")
      .select("config")
      .eq("store_id", storeId)
      .eq("module_id", "discount-spin-wheel")
      .maybeSingle(),
    supabase
      .from("campaigns")
      .select("id, status, config")
      .eq("store_id", storeId)
      .eq("module_id", "discount-spin-wheel")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  let config = defaultWheelConfig;
  const source = moduleRow?.config ?? campaign?.config;
  if (source) {
    const parsed = wheelConfigSchema.safeParse(source);
    if (parsed.success) config = parsed.data;
  }

  return {
    config,
    campaignId: campaign?.id ?? null,
    status: campaign?.status ?? "draft",
  };
}

export async function saveWheelSettingsAction(input: unknown) {
  const parsed = saveSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Geçersiz giriş" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Yetkisiz işlem" };

  const { storeId, config, status } = parsed.data;

  if (!(await hasModuleAccess(storeId, "sans_carki"))) {
    return { ok: false as const, error: "Bu modül aktif değil. Önce satın alın." };
  }

  const { error: moduleError } = await supabase.from("store_modules").upsert(
    {
      store_id: storeId,
      module_id: "discount-spin-wheel",
      enabled: true,
      config,
    },
    { onConflict: "store_id,module_id" },
  );
  if (moduleError) return { ok: false as const, error: moduleError.message };

  const { data: existing } = await supabase
    .from("campaigns")
    .select("id")
    .eq("store_id", storeId)
    .eq("module_id", "discount-spin-wheel")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("campaigns")
      .update({ name: config.title, config, status })
      .eq("id", existing.id);
    if (error) return { ok: false as const, error: error.message };
  } else {
    if (subscriptionsEnforced()) {
      const limit = await canCreateCampaign(storeId);
      if (!limit.allowed) {
        return { ok: false as const, error: "Mevcut planınızın kampanya limitine ulaştınız. Planınızı yükseltin." };
      }
    }
    const { error } = await supabase.from("campaigns").insert({
      store_id: storeId,
      module_id: "discount-spin-wheel",
      name: config.title,
      status,
      config,
      created_by: user.id,
    });
    if (error) return { ok: false as const, error: error.message };
  }

  await recordAuditEvent({
    storeId,
    action: "wheel.settings_saved",
    targetType: "campaign",
    targetId: existing?.id,
    metadata: { status, segmentCount: config.segments.length },
  });

  revalidatePath("/dashboard");
  revalidatePath("/demo");
  return { ok: true as const };
}

const statusSchema = z.object({
  campaignId: z.string().uuid(),
  status: z.enum(["draft", "active", "paused", "archived"]),
});

export async function setWheelCampaignStatusAction(input: unknown) {
  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Geçersiz giriş" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Yetkisiz işlem" };

  const { error } = await supabase
    .from("campaigns")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.campaignId);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/dashboard/wheel");
  revalidatePath("/demo");
  return { ok: true as const };
}

export async function listWheelCampaigns(storeId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("id, name, status, starts_at, ends_at, config, created_at")
    .eq("store_id", storeId)
    .eq("module_id", "discount-spin-wheel")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getActiveWheelCampaign(storeId: string) {
  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("campaigns")
    .select("id, name, status, starts_at, ends_at, config")
    .eq("store_id", storeId)
    .eq("module_id", "discount-spin-wheel")
    .eq("status", "active")
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  if (data.ends_at && new Date(data.ends_at) < new Date()) return null;
  return data;
}

function pickSegment(segments: WheelConfig["segments"]) {
  const total = segments.reduce((s, seg) => s + seg.weight, 0);
  let r = randomInt(0, total);
  for (const seg of segments) {
    r -= seg.weight;
    if (r < 0) return seg;
  }
  return segments[segments.length - 1];
}

export async function spinWheelAction(campaignId: string) {
  if (!hasSupabaseConfig()) return { ok: false as const, error: "Supabase yapılandırılmamış." };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rateKey = `spin:${campaignId}:${user?.id ?? "anon"}`;
  const rate = await checkRateLimitAsync(rateKey, 5, 60_000);
  if (!rate.allowed) {
    return { ok: false as const, error: "Çok fazla çevirme denemesi. Lütfen daha sonra tekrar deneyin." };
  }

  const { data: campaign, error: campErr } = await supabase
    .from("campaigns")
    .select("id, store_id, status, starts_at, ends_at, config")
    .eq("id", campaignId)
    .single();

  if (campErr || !campaign) return { ok: false as const, error: "Kampanya bulunamadı." };
  if (!(await hasModuleAccess(campaign.store_id, "sans_carki"))) {
    return { ok: false as const, error: "Bu modül aktif değil. Önce satın alın." };
  }
  if (campaign.status !== "active") return { ok: false as const, error: "Kampanya etkin değil." };
  const now = new Date();
  if (campaign.starts_at && new Date(campaign.starts_at) > now) return { ok: false as const, error: "Kampanya henüz başlamadı." };
  if (campaign.ends_at && new Date(campaign.ends_at) < now) return { ok: false as const, error: "Kampanyanın süresi doldu." };

  const config = wheelConfigSchema.safeParse(campaign.config);
  if (!config.success) return { ok: false as const, error: "Geçersiz kampanya yapılandırması." };

  const segment = pickSegment(config.data.segments);

  let couponCode: string | null = null;
  let expiresAt: string | null = null;

  if (segment.prizeType === "coupon") {
    const service = createSupabaseServiceClient();
    const client = service ?? supabase;
    const storeId = campaign.store_id;
    const code = generateCouponCode();
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { error: couponErr } = await client.from("coupons").insert({
      store_id: storeId,
      campaign_id: campaign.id,
      code,
      discount_type: segment.discountType ?? "percentage",
      discount_value: segment.discountValue ?? 0,
      status: "active",
      expires_at: expiry,
      usage_limit: 1,
      usage_count: 0,
    });
    if (couponErr) return { ok: false as const, error: couponErr.message };
    couponCode = code;
    expiresAt = expiry;
  }

  // Record analytics event (best effort, subject to plan interaction quota)
  if (await canRecordInteraction(campaign.store_id)) {
    const service = createSupabaseServiceClient();
    const client = service ?? supabase;
    await client.from("analytics_events").insert({
      store_id: campaign.store_id,
      module_id: "discount-spin-wheel",
      campaign_id: campaign.id,
      event_type: "wheel_spin",
      payload: { segmentId: segment.id, label: segment.label, couponIssued: Boolean(couponCode), userId: user?.id ?? null },
    });
  }

  return {
    ok: true as const,
    segmentId: segment.id,
    label: segment.label,
    color: segment.color,
    prizeType: segment.prizeType,
    couponCode,
    expiresAt,
  };
}

const redeemSchema = z.object({
  code: z.string().min(1),
  customerEmail: z.string().email().optional(),
});

export async function redeemCouponAction(input: unknown) {
  const parsed = redeemSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Geçersiz giriş" };

  const supabase = await createSupabaseServerClient();
  const { code, customerEmail } = parsed.data;

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("id, store_id, status, expires_at, usage_limit, usage_count")
    .eq("code", code)
    .maybeSingle();

  if (error || !coupon) return { ok: false as const, error: "Kupon bulunamadı." };
  if (coupon.status !== "active") return { ok: false as const, error: "Kupon etkin değil." };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return { ok: false as const, error: "Kuponun süresi doldu." };
  if (coupon.usage_count >= coupon.usage_limit) return { ok: false as const, error: "Kupon daha önce kullanıldı." };

  const service = createSupabaseServiceClient();
  const client = service ?? supabase;

  const { error: updErr } = await client
    .from("coupons")
    .update({ usage_count: coupon.usage_count + 1, status: coupon.usage_count + 1 >= coupon.usage_limit ? "redeemed" : "active" })
    .eq("id", coupon.id);
  if (updErr) return { ok: false as const, error: updErr.message };

  await client.from("coupon_redemptions").insert({
    coupon_id: coupon.id,
    store_id: coupon.store_id,
    customer_email: customerEmail ?? null,
    metadata: {},
  });

  return { ok: true as const, message: "Kupon kullanıldı." };
}