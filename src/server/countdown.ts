"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  countdownConfigSchema,
  getDefaultCountdownConfig,
  type CountdownConfig,
} from "@/lib/validations/countdown";
import { recordAuditEvent } from "@/server/audit";

const createSchema = z.object({
  storeId: z.string().uuid(),
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  endsAt: z.string().datetime(),
  startsAt: z.string().datetime().optional().nullable(),
  status: z.enum(["draft", "active", "paused", "archived"]).default("draft"),
});

export async function createCountdownCampaignAction(input: unknown) {
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid input" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Unauthorized" };

  const { storeId, title, description, endsAt, startsAt, status } = parsed.data;
  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      store_id: storeId,
      module_id: "countdown-campaigns",
      name: title,
      status,
      starts_at: startsAt ?? null,
      ends_at: endsAt,
      config: { title, description: description ?? "" },
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/dashboard/countdown");
  return { ok: true as const, campaignId: data.id };
}

export async function listCountdownCampaigns(storeId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("id, name, status, starts_at, ends_at, config, created_at")
    .eq("store_id", storeId)
    .eq("module_id", "countdown-campaigns")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getActiveCountdowns(storeId: string) {
  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("campaigns")
    .select("id, name, status, starts_at, ends_at, config")
    .eq("store_id", storeId)
    .eq("module_id", "countdown-campaigns")
    .eq("status", "active")
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) return [];
  // Return the latest active campaign even if its end date has passed so the
  // widget can render an explicit "Expired" state instead of disappearing.
  return data ?? [];
}
export async function trackCountdownImpressionAction(campaignId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, store_id")
    .eq("id", campaignId)
    .maybeSingle();
  if (!campaign) return { ok: false as const };

  await supabase.from("analytics_events").insert({
    store_id: campaign.store_id,
    module_id: "countdown-campaigns",
    campaign_id: campaign.id,
    event_type: "countdown_impression",
    payload: {},
  });
  return { ok: true as const };
}

const saveSettingsSchema = z.object({
  storeId: z.string().uuid(),
  config: countdownConfigSchema,
  status: z.enum(["draft", "active", "paused", "archived"]).default("draft"),
});

export async function getCountdownSettings(storeId: string): Promise<{
  config: CountdownConfig;
  campaignId: string | null;
  status: string;
}> {
  const supabase = await createSupabaseServerClient();
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name, status, starts_at, ends_at, config")
    .eq("store_id", storeId)
    .eq("module_id", "countdown-campaigns")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!campaign) {
    return { config: getDefaultCountdownConfig(), campaignId: null, status: "draft" };
  }

  const cfg = (campaign.config ?? {}) as { title?: string; description?: string };
  return {
    config: {
      title: cfg.title ?? campaign.name,
      description: cfg.description ?? "",
      endsAt: campaign.ends_at ?? getDefaultCountdownConfig().endsAt,
      startsAt: campaign.starts_at ?? null,
    },
    campaignId: campaign.id,
    status: campaign.status,
  };
}

export async function saveCountdownSettingsAction(input: unknown) {
  const parsed = saveSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid input" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Unauthorized" };

  const { storeId, config, status } = parsed.data;

  const { error: moduleError } = await supabase.from("store_modules").upsert(
    {
      store_id: storeId,
      module_id: "countdown-campaigns",
      enabled: true,
      config: { title: config.title, description: config.description ?? "" },
    },
    { onConflict: "store_id,module_id" },
  );
  if (moduleError) return { ok: false as const, error: moduleError.message };

  const { data: existing } = await supabase
    .from("campaigns")
    .select("id")
    .eq("store_id", storeId)
    .eq("module_id", "countdown-campaigns")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let campaignId: string;

  if (existing) {
    const { data, error } = await supabase
      .from("campaigns")
      .update({
        name: config.title,
        status,
        starts_at: config.startsAt ?? null,
        ends_at: config.endsAt,
        config: { title: config.title, description: config.description ?? "" },
      })
      .eq("id", existing.id)
      .select("id")
      .single();
    if (error || !data) return { ok: false as const, error: error?.message ?? "Update failed" };
    campaignId = data.id;
  } else {
    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        store_id: storeId,
        module_id: "countdown-campaigns",
        name: config.title,
        status,
        starts_at: config.startsAt ?? null,
        ends_at: config.endsAt,
        config: { title: config.title, description: config.description ?? "" },
        created_by: user.id,
      })
      .select("id")
      .single();
    if (error || !data) return { ok: false as const, error: error?.message ?? "Insert failed" };
    campaignId = data.id;
  }

  // Keep only one current countdown campaign per store; archive stale ones.
  await supabase
    .from("campaigns")
    .update({ status: "archived" })
    .eq("store_id", storeId)
    .eq("module_id", "countdown-campaigns")
    .neq("id", campaignId);

  await recordAuditEvent({
    storeId,
    action: "countdown.settings_saved",
    targetType: "campaign",
    targetId: campaignId,
    metadata: { status },
  });

  revalidatePath("/dashboard");
  revalidatePath("/demo");
  return { ok: true as const };
}
