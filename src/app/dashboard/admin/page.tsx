export const instant = false;
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { isPlatformAdmin } from "@/lib/admin";

export default async function AdminPage() {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Platform yönetimi</h1>
        <p className="mt-4 text-sm text-zinc-400">Supabase yapılandırılmamış.</p>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const admin = await isPlatformAdmin();
  if (!admin) redirect("/dashboard");

  const { count: users } = await supabase.from("profiles").select("id", { count: "exact", head: true });
  const { count: stores } = await supabase.from("stores").select("id", { count: "exact", head: true });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-white">Platform yönetimi</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Ayrıcalıklı görünüm. Erişim sunucu tarafında doğrulanır.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="surface rounded-2xl p-5">
          <p className="text-xs text-zinc-500">Kullanıcılar</p>
          <p className="mt-2 text-2xl font-semibold text-white">{users ?? 0}</p>
        </div>
        <div className="surface rounded-2xl p-5">
          <p className="text-xs text-zinc-500">Mağazalar</p>
          <p className="mt-2 text-2xl font-semibold text-white">{stores ?? 0}</p>
        </div>
      </div>
    </div>
  );
}