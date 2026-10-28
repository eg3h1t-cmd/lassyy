import { listStoreModules } from "@/server/modules";
import { ModuleToggle } from "@/components/dashboard/module-toggle";
import type { Module } from "@/types/modules";

type Store = { id: string; name: string };

export async function StoreModuleSection({ store, modules }: { store: Store; modules: Module[] }) {
  const enabled = await listStoreModules(store.id);
  const enabledMap = new Map(enabled.map((m) => [m.module_id, m.enabled]));
  return (
    <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="font-semibold">{store.name}</h2>
      <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
        {modules.map((m) => (
          <li key={m.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-xs text-zinc-500">{m.description}</p>
            </div>
            <ModuleToggle storeId={store.id} moduleId={m.id} initialEnabled={enabledMap.get(m.id) ?? false} />
          </li>
        ))}
      </ul>
    </section>
  );
}