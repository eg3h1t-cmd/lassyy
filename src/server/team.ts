"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type TeamMember = {
  user_id: string;
  email: string;
  role: string;
  created_at: string;
};

export async function listTeamMembers(storeId: string): Promise<TeamMember[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("list_store_members", { target_store_id: storeId });
  if (error) return [];
  return (data ?? []) as TeamMember[];
}

const addSchema = z.object({
  storeId: z.string().uuid(),
  email: z.string().email(),
});

export async function addTeamMemberAction(input: unknown) {
  const parsed = addSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Geçerli bir e-posta adresi girin." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("add_store_member_by_email", {
    target_store_id: parsed.data.storeId,
    member_email: parsed.data.email,
  });

  if (error) {
    if (error.message.includes("user_not_found")) {
      return { ok: false as const, error: "Bu e-posta ile kayıtlı bir kullanıcı bulunamadı." };
    }
    if (error.message.includes("not_store_owner")) {
      return { ok: false as const, error: "Bu işlem için mağaza sahibi olmanız gerekiyor." };
    }
    return { ok: false as const, error: "Ekip üyesi eklenemedi." };
  }

  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function removeTeamMemberAction(input: unknown) {
  const parsed = z.object({ storeId: z.string().uuid(), userId: z.string().uuid() }).safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Geçersiz giriş" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("remove_store_member", {
    target_store_id: parsed.data.storeId,
    member_user_id: parsed.data.userId,
  });
  if (error) return { ok: false as const, error: "Ekip üyesi kaldırılamadı." };
  revalidatePath("/dashboard");
  return { ok: true as const };
}