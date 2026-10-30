export const instant = false;

import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { getStoreBySlug } from "@/server/stores";
import { getStorePlan } from "@/server/subscriptions";
import { listApiKeys } from "@/server/api-keys";
import { ApiKeysManager } from "@/components/dashboard/api-keys-manager";

export default async function ApiPage({ params }: { params: Promise<{ storeSlug: string }> }) {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">API erişimi</h1>
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

  const plan = await getStorePlan(store.id);
  const allowed = plan === "enterprise";
  const keys = allowed ? await listApiKeys(store.id) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href={`/dashboard/${store.slug}/modules/wheel`} className="text-sm text-zinc-600 hover:text-zinc-900">
        ← Modüllere dön
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">API erişimi</h1>
      <p className="mt-1 text-sm text-zinc-600">{store.name}</p>

      {allowed ? (
        <div className="surface mt-8 rounded-2xl p-5">
          <ApiKeysManager storeId={store.id} initial={keys} />
        </div>
      ) : (
        <div className="surface mt-8 rounded-2xl p-6">
          <h2 className="font-semibold text-zinc-900">API erişimi Kurumsal plana dahildir</h2>
          <p className="mt-2 text-sm text-zinc-600">
            API anahtarı oluşturmak için planınızı yükseltin. Şimdilik bizimle iletişime geçebilirsiniz.
          </p>
          <a
            href="mailto:eg3h1t@gmail.com?subject=lassyy%20Kurumsal%20plan"
            className="accent-gradient glow-button mt-4 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white"
          >
            İletişime geç
          </a>
        </div>
      )}
    </div>
  );
}