export const instant = false;
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
        <h1 className="text-2xl font-semibold">İndirim çarkı</h1>
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
      <h1 className="text-2xl font-semibold text-zinc-900">Çarkıfelek İndirimi</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Çark kampanyaları oluşturun ve yönetin. Sonuçlar sunucu tarafında belirlenir.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-900">Kampanya oluştur</h2>
        <WheelCreateForm stores={stores} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-900">Mevcut kampanyalar</h2>
        {stores.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600">Önce bir mağaza oluşturun.</p>
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

