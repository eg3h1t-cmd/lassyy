"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StoreModuleRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
};

export async function listStoreCatalog() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("modules")
    .select("id, slug, name, description, price")
    .gt("price", 0)
    .order("price", { ascending: true });
  if (error) return [] as StoreModuleRow[];
  return (data ?? []).map((row) => ({ ...row, price: Number(row.price) })) as StoreModuleRow[];
}

export async function listTenantModules(tenantId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tenant_modules")
    .select("module_id, status, purchased_at")
    .eq("tenant_id", tenantId);
  if (error) return [];
  return data ?? [];
}

const requestSchema = z.object({
  storeId: z.string().uuid(),
  moduleSlug: z.string().min(1),
});

export async function requestModulePurchaseAction(input: unknown) {
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Geçersiz giriş" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Giriş yapmanız gerekiyor." };

  const { data: moduleRow } = await supabase
    .from("modules")
    .select("id, name")
    .eq("slug", parsed.data.moduleSlug)
    .maybeSingle();

  if (!moduleRow) return { ok: false as const, error: "Modül bulunamadı." };

  const { data: existing } = await supabase
    .from("tenant_modules")
    .select("status")
    .eq("tenant_id", parsed.data.storeId)
    .eq("module_id", moduleRow.id)
    .maybeSingle();

  if (existing?.status === "active") {
    return { ok: true as const, status: "active" as const };
  }
  if (existing?.status === "pending") {
    return { ok: true as const, status: "pending" as const };
  }

  const { error } = await supabase.from("tenant_modules").insert({
    tenant_id: parsed.data.storeId,
    module_id: moduleRow.id,
    status: "pending",
  });

  if (error) return { ok: false as const, error: "Satın alma talebi oluşturulamadı." };

  revalidatePath("/dashboard");
  return { ok: true as const, status: "pending" as const };
}