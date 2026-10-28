import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { listMyStores } from "@/server/stores";
import { StoreAnalyticsSection } from "@/components/dashboard/store-analytics-section";

export default async function AnalyticsPage() {
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Supabase is not configured.</p>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const stores = await listMyStores();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Metrics are computed from stored events.
      </p>
      <nav className="mt-4 flex gap-4 text-sm">
        <a href="/dashboard" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Overview</a>
        <a href="/dashboard/modules" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Modules</a>
        <a href="/dashboard/wheel" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Wheel</a>
        <a href="/dashboard/analytics" className="font-medium text-zinc-900 dark:text-zinc-100">Analytics</a>
      </nav>

      <div className="mt-8 space-y-8">
        {stores.length === 0 && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Create a store first.</p>
        )}
        {stores.map((store) => (
          <StoreAnalyticsSection key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}