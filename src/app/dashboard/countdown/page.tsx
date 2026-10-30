export const instant = false;
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { listMyStores } from "@/server/stores";
import { CountdownCreateForm } from "@/components/dashboard/countdown-create-form";
import { StoreCountdownList } from "@/components/dashboard/store-countdown-list";

export default async function CountdownPage() {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Geri Sayım Kampanyaları</h1>
        <p className="mt-4 text-sm text-zinc-600">Supabase yapılandırılmamış.</p>
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
      <h1 className="text-2xl font-semibold text-zinc-900">Geri Sayım Kampanyaları</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Sunucu taraflı güvenli bitiş tarihli, süre sınırlı kampanyalar.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-900">Kampanya oluştur</h2>
        <CountdownCreateForm stores={stores} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-900">Mevcut kampanyalar</h2>
        {stores.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">Önce bir mağaza oluşturun.</p>
        ) : (
          <div className="mt-4 space-y-6">
            {stores.map((store) => (
              <StoreCountdownList key={store.id} store={store} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

