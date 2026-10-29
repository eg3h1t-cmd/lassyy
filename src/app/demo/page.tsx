export const instant = false;
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { listMyStores } from "@/server/stores";
import { StoreDemoSection } from "@/components/demo/store-demo-section";

export default async function DemoPage() {
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Demo storefront</h1>
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
      <h1 className="text-2xl font-semibold">Demo storefront</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Preview your configured modules. Outcomes are determined on the server.
      </p>

      <div className="mt-8 space-y-10">
        {stores.length === 0 && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Create a store first.</p>
        )}
        {stores.map((store) => (
          <StoreDemoSection key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}

