import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { listMyStores } from "@/server/stores";
import { listModules } from "@/server/modules";
import { StoreModuleSection } from "@/components/dashboard/store-module-section";
import type { Module } from "@/types/modules";

export default async function ModulesPage() {
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Modules</h1>
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
  const modules = (await listModules()) as Module[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Module configuration</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Enable or disable modules per store.
      </p>

      {stores.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">Create a store first.</p>
      ) : (
        <div className="mt-6 space-y-8">
          {stores.map((store) => (
            <StoreModuleSection key={store.id} store={store} modules={modules} />
          ))}
        </div>
      )}
    </div>
  );
}