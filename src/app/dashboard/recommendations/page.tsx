export const instant = false;
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { listMyStores } from "@/server/stores";
import { StoreRecommendationsSection } from "@/components/dashboard/store-recommendations-section";

export default async function RecommendationsPage() {
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Product recommendations</h1>
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
      <h1 className="text-2xl font-semibold">Product recommendations</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Manually configure complementary products shown to shoppers.
      </p>
      <nav className="mt-4 flex gap-4 text-sm">
        <a href="/dashboard" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Overview</a>
        <a href="/dashboard/recommendations" className="font-medium text-zinc-900 dark:text-zinc-100">Recommendations</a>
      </nav>

      <div className="mt-8 space-y-8">
        {stores.length === 0 && <p className="text-sm text-zinc-600 dark:text-zinc-400">Create a store first.</p>}
        {stores.map((store) => (
          <StoreRecommendationsSection key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}

