"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomInt } from "node:crypto";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";

const segmentSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(60),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  prizeType: z.enum(["coupon", "none"]),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.number().min(0).optional(),
  weight: z.number().int().min(1).max(1000),
});

const wheelConfigSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  segments: z.array(segmentSchema).min(2).max(12),
  spinDurationMs: z.number().int().min(2000).max(8000).default(4000),
});

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
  if (!parsed.success) return { ok: false as const, error: "Invalid input" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Unauthorized" };

  const { storeId, config, status, startsAt, endsAt } = parsed.data;

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

const statusSchema = z.object({
  campaignId: z.string().uuid(),
  status: z.enum(["draft", "active", "paused", "archived"]),
});

export async function setWheelCampaignStatusAction(input: unknown) {
  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid input" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Unauthorized" };

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

function pickSegment(segments: z.infer<typeof segmentSchema>[]) {
  const total = segments.reduce((s, seg) => s + seg.weight, 0);
  let r = randomInt(0, total);
  for (const seg of segments) {
    r -= seg.weight;
    if (r < 0) return seg;
  }
  return segments[segments.length - 1];
}

export async function spinWheelAction(campaignId: string) {
  if (!hasSupabaseConfig()) return { ok: false as const, error: "Supabase not configured" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rateKey = `spin:${campaignId}:${user?.id ?? "anon"}`;
  const rate = checkRateLimit(rateKey, 5, 60_000);
  if (!rate.allowed) {
    return { ok: false as const, error: "Too many spins. Try again later." };
  }

  const { data: campaign, error: campErr } = await supabase
    .from("campaigns")
    .select("id, store_id, status, starts_at, ends_at, config")
    .eq("id", campaignId)
    .single();

  if (campErr || !campaign) return { ok: false as const, error: "Campaign not found" };
  if (campaign.status !== "active") return { ok: false as const, error: "Campaign not active" };
  const now = new Date();
  if (campaign.starts_at && new Date(campaign.starts_at) > now) return { ok: false as const, error: "Campaign not started" };
  if (campaign.ends_at && new Date(campaign.ends_at) < now) return { ok: false as const, error: "Campaign expired" };

  const config = wheelConfigSchema.safeParse(campaign.config);
  if (!config.success) return { ok: false as const, error: "Invalid campaign config" };

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

  // Record analytics event (best effort)
  const service = createSupabaseServiceClient();
  const client = service ?? supabase;
  await client.from("analytics_events").insert({
    store_id: campaign.store_id,
    module_id: "discount-spin-wheel",
    campaign_id: campaign.id,
    event_type: "wheel_spin",
    payload: { segmentId: segment.id, label: segment.label, couponIssued: Boolean(couponCode), userId: user?.id ?? null },
  });

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
  if (!parsed.success) return { ok: false as const, error: "Invalid input" };

  const supabase = await createSupabaseServerClient();
  const { code, customerEmail } = parsed.data;

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("id, store_id, status, expires_at, usage_limit, usage_count")
    .eq("code", code)
    .maybeSingle();

  if (error || !coupon) return { ok: false as const, error: "Coupon not found" };
  if (coupon.status !== "active") return { ok: false as const, error: "Coupon not active" };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return { ok: false as const, error: "Coupon expired" };
  if (coupon.usage_count >= coupon.usage_limit) return { ok: false as const, error: "Coupon already used" };

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

  return { ok: true as const, message: "Coupon redeemed" };
}