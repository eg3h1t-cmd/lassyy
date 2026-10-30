export const instant = false;

import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { getStoreBySlug } from "@/server/stores";
import { listStoreCatalog, listTenantModules } from "@/server/module-store";
import { ModuleStorePanel } from "@/components/dashboard/module-store-panel";

export default async function StorePage({ params }: { params: Promise<{ storeSlug: string }> }) {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Modül Mağazası</h1>
        <p className="mt-4 text-sm text-zinc-600">Supabase yapılandırılmamış.</p>
      </div>
    );
  }

  const { storeSlug } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  const [modules, tenantModules] = await Promise.all([
    listStoreCatalog(),
    listTenantModules(store.id),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/dashboard" className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
        ← Genel bakışa dön
      </Link>
      <div className="mt-2">
        <h1 className="text-2xl font-semibold text-zinc-900">Modül Mağazası</h1>
        <p className="mt-1 text-sm text-zinc-600">
          {store.name} için ihtiyacınız olan modülleri tek tek satın alın. Abonelik yok.
        </p>
      </div>

      <div className="mt-8">
        <ModuleStorePanel storeId={store.id} storeSlug={store.slug} modules={modules} tenantModules={tenantModules} />
      </div>
    </div>
  );
}