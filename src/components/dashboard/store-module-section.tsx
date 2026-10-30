import Link from "next/link";
import { listStoreModules } from "@/server/modules";
import { ModuleToggle } from "@/components/dashboard/module-toggle";
import { moduleLabels } from "@/lib/module-labels";
import type { Module } from "@/types/modules";

type Store = { id: string; name: string; slug: string };

export async function StoreModuleSection({ store, modules }: { store: Store; modules: Module[] }) {
  const enabled = await listStoreModules(store.id);
  const enabledMap = new Map(enabled.map((m) => [m.module_id, m.enabled]));
  return (
    <section className="surface rounded-2xl p-5">
      <h2 className="font-semibold text-zinc-900">{store.name}</h2>
      <ul className="mt-4 divide-y divide-zinc-200">
        {modules.map((m) => {
          const label = moduleLabels[m.id];
          const route = label?.route;
          return (
            <li key={m.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-zinc-900">{label?.name ?? m.name}</p>
                <p className="text-xs text-zinc-500">{label?.description ?? m.description}</p>
              </div>
              <div className="flex items-center gap-3">
                {route && (
                  <Link
                    href={`/dashboard/${store.slug}/modules/${route}`}
                    className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-200 transition-colors hover:border-indigo-400/40 hover:bg-zinc-100"
                  >
                    Yapılandır
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