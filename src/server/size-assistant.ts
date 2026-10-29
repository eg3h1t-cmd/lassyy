"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasModuleAccess } from "@/server/module-access";
import {
  defaultSizeAssistantConfig,
  sizeAssistantConfigSchema,
  type SizeAssistantConfig,
} from "@/lib/validations/size-assistant";

export async function getSizeAssistantConfig(storeId: string): Promise<SizeAssistantConfig> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("store_modules")
    .select("config")
    .eq("store_id", storeId)
    .eq("module_id", "akilli_beden")
    .maybeSingle();
  const parsed = sizeAssistantConfigSchema.safeParse(data?.config);
  return parsed.success ? parsed.data : defaultSizeAssistantConfig;
}

const saveSchema = z.object({
  storeId: z.string().uuid(),
  config: sizeAssistantConfigSchema,
});

export async function saveSizeAssistantConfigAction(input: unknown) {
  const parsed = saveSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Geçersiz giriş" };

  if (!(await hasModuleAccess(parsed.data.storeId, "akilli_beden"))) {
    return { ok: false as const, error: "Bu modül aktif değil. Önce satın alın." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("store_modules").upsert(
    {
      store_id: parsed.data.storeId,
      module_id: "akilli_beden",
      enabled: true,
      config: parsed.data.config,
    },
    { onConflict: "store_id,module_id" },
  );
  if (error) return { ok: false as const, error: "Ayarlar kaydedilemedi." };

  revalidatePath("/dashboard");
  revalidatePath("/demo");
  return { ok: true as const };
}