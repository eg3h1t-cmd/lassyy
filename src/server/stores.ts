"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createStoreSchema } from "@/server/store-validation";

export type CreateStoreResult =
  | { ok: true; storeId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createStoreAction(input: unknown): Promise<CreateStoreResult> {
  const parsed = createStoreSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  const { data, error } = await supabase
    .from("stores")
    .insert({ name: parsed.data.name, slug: parsed.data.slug, owner_id: user.id })
    .select("id")
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  // Record ownership as a store member for consistency.
  await supabase.from("store_members").insert({
    store_id: data.id,
    user_id: user.id,
    role: "owner",
  });

  revalidatePath("/dashboard");
  return { ok: true, storeId: data.id };
}

export async function getStoreBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("stores")
    .select("id, name, slug, owner_id, created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function listMyStores() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("stores")
    .select("id, name, slug, created_at")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}