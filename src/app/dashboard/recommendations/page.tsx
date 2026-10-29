export const instant = false;
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { listMyStores } from "@/server/stores";
import { StoreRecommendationsSection } from "@/components/dashboard/store-recommendations-section";

export default async function RecommendationsPage() {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Ürün Önerileri</h1>
        <p className="mt-4 text-sm text-zinc-400">Supabase yapılandırılmamış.</p>
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
      <h1 className="text-2xl font-semibold text-white">Ürün Önerileri</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Müşterilere gösterilecek tamamlayıcı ürünleri manuel olarak yapılandırın.
      </p>

      <div className="mt-8 space-y-8">
        {stores.length === 0 && <p className="text-sm text-zinc-400">Önce bir mağaza oluşturun.</p>}
        {stores.map((store) => (
          <StoreRecommendationsSection key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}

