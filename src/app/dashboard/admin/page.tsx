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
        <h1 className="text-2xl font-semibold">Platform admin</h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Supabase is not configured.</p>
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
      <h1 className="text-2xl font-semibold">Platform administration</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Privileged view. Access verified server-side.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs text-zinc-500">Users</p>
          <p className="mt-2 text-2xl font-semibold">{users ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs text-zinc-500">Stores</p>
          <p className="mt-2 text-2xl font-semibold">{stores ?? 0}</p>
        </div>
      </div>
    </div>
  );
}

