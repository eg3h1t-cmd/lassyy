import { getStoreAnalytics } from "@/server/analytics";

export async function StoreAnalyticsSection({ store }: { store: { id: string; name: string } }) {
  const metrics = await getStoreAnalytics(store.id);
  return (
    <section className="surface rounded-2xl p-5">
      <h2 className="font-semibold text-white">{store.name}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          ["Gösterimler", metrics.impressions],
          ["Çevirmeler", metrics.spins],
          ["Kuponlar", metrics.coupons],
          ["Kullanımlar", metrics.redemptions],
          ["Öneri gösterimleri", metrics.recommendationImpressions],
          ["Öneri tıklamaları", metrics.recommendationClicks],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}