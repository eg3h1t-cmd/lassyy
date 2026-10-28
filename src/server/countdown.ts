"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []).filter((c) => !c.ends_at || new Date(c.ends_at) > new Date());
}