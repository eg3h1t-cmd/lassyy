import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";

export default async function DashboardPage() {
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY to enable authentication and data.
        </p>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Signed in as {user.email}. Store data and modules will appear here once the
        database schema is applied.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Active campaigns", "Modules enabled", "Coupons issued", "Impressions"].map((label) => (
          <div
            key={label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}