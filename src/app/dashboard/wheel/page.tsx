import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { listMyStores } from "@/server/stores";
import { WheelCreateForm } from "@/components/dashboard/wheel-create-form";
import { StoreCampaignList } from "@/components/dashboard/store-campaign-list";

export default async function WheelPage() {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Discount wheel</h1>
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
      <h1 className="text-2xl font-semibold">Discount spin wheel</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Create and manage wheel campaigns. Outcomes are determined on the server.
      </p>

      <nav className="mt-4 flex gap-4 text-sm">
        <a href="/dashboard" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Overview</a>
        <a href="/dashboard/modules" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Modules</a>
        <a href="/dashboard/wheel" className="font-medium text-zinc-900 dark:text-zinc-100">Wheel</a>
      </nav>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Create campaign</h2>
        <WheelCreateForm stores={stores} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Existing campaigns</h2>
        {stores.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">Create a store first.</p>
        ) : (
          <div className="mt-4 space-y-6">
            {stores.map((store) => (
              <StoreCampaignList key={store.id} store={store} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

