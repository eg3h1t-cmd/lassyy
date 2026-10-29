import Link from "next/link";
import { listStoreModules } from "@/server/modules";
import { ModuleToggle } from "@/components/dashboard/module-toggle";
import type { Module } from "@/types/modules";

type Store = { id: string; name: string; slug: string };

const moduleRoutes: Record<string, string> = {
  "discount-spin-wheel": "wheel",
  "countdown-campaigns": "countdown",
  analytics: "analytics",
  "product-recommendations": "recommendations",
};

export async function StoreModuleSection({ store, modules }: { store: Store; modules: Module[] }) {
  const enabled = await listStoreModules(store.id);
  const enabledMap = new Map(enabled.map((m) => [m.module_id, m.enabled]));
  return (
    <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="font-semibold">{store.name}</h2>
      <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
        {modules.map((m) => {
          const route = moduleRoutes[m.id];
          return (
            <li key={m.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-zinc-500">{m.description}</p>
              </div>
              <div className="flex items-center gap-3">
                {route && (
                  <Link
                    href={`/dashboard/${store.slug}/modules/${route}`}
                    className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                  >
                    Configure
                  </Link>
                )}
                <ModuleToggle storeId={store.id} moduleId={m.id} initialEnabled={enabledMap.get(m.id) ?? false} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}