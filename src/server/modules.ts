"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const setModuleSchema = z.object({
  storeId: z.string().uuid(),
  moduleId: z.string().min(1),
  enabled: z.boolean(),
});

export async function listModules() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("modules").select("id, name, description").order("id");
  if (error) return [];
  return data ?? [];
}

export async function listStoreModules(storeId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("store_modules")
    .select("module_id, enabled, config")
    .eq("store_id", storeId);
  if (error) return [];
  return data ?? [];
}

export async function setModuleEnabledAction(input: unknown) {
  const parsed = setModuleSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Geçersiz giriş" };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Yetkisiz işlem" };

  const { storeId, moduleId, enabled } = parsed.data;

  const { error } = await supabase.from("store_modules").upsert(
    {
      store_id: storeId,
      module_id: moduleId,
      enabled,
      config: {},
    },
    { onConflict: "store_id,module_id" },
  );

  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/dashboard/modules");
  return { ok: true as const };
}