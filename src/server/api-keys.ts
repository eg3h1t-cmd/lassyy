"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hashApiKey } from "@/lib/api-key";
import { getStorePlan } from "@/server/subscriptions";

export type ApiKeyRow = {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

export async function listApiKeys(storeId: string): Promise<ApiKeyRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, last_used_at, revoked_at, created_at")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

const createSchema = z.object({
  storeId: z.string().uuid(),
  name: z.string().trim().min(1).max(80),
});

export async function createApiKeyAction(input: unknown) {
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Geçerli bir anahtar adı girin." };

  const plan = await getStorePlan(parsed.data.storeId);
  if (plan !== "enterprise") {
    return { ok: false as const, error: "API erişimi yalnızca Kurumsal plana dahildir." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "Yetkisiz işlem" };

  const plaintext = `lsk_${randomBytes(24).toString("hex")}`;
  const { error } = await supabase.from("api_keys").insert({
    store_id: parsed.data.storeId,
    name: parsed.data.name,
    key_hash: hashApiKey(plaintext),
    key_prefix: plaintext.slice(0, 12),
    created_by: user.id,
  });
  if (error) return { ok: false as const, error: "API anahtarı oluşturulamadı." };

  revalidatePath("/dashboard");
  return { ok: true as const, key: plaintext };
}

export async function revokeApiKeyAction(input: unknown) {
  const parsed = z.object({ id: z.string().uuid() }).safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Geçersiz giriş" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("api_keys").update({ revoked_at: new Date().toISOString() }).eq("id", parsed.data.id);
  if (error) return { ok: false as const, error: "Anahtar iptal edilemedi." };
  revalidatePath("/dashboard");
  return { ok: true as const };
}