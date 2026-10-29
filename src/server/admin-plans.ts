"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminStoreRow = {
  id: string;
  name: string;
  slug: string;
  owner_email: string;
  plan_id: string;
  status: string;
};

export async function listAdminStores(): Promise<AdminStoreRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("admin_list_stores");
  if (error) return [];
  return (data ?? []) as AdminStoreRow[];
}

const setPlanSchema = z.object({
  storeId: z.string().uuid(),
  planId: z.enum(["starter", "growth", "enterprise"]),
  status: z.enum(["active", "trialing", "past_due", "canceled", "incomplete"]).default("active"),
});

export async function setStorePlanAction(input: unknown) {
  const parsed = setPlanSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Geçersiz giriş" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_set_store_plan", {
    target_store_id: parsed.data.storeId,
    target_plan: parsed.data.planId,
    target_status: parsed.data.status,
  });
  if (error) return { ok: false as const, error: "Plan güncellenemedi." };
  revalidatePath("/dashboard/admin");
  return { ok: true as const };
}