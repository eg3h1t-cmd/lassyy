import { getStoreAnalytics } from "@/server/analytics";

export async function StoreAnalyticsSection({ store }: { store: { id: string; name: string } }) {
  const metrics = await getStoreAnalytics(store.id);
  return (
    <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="font-semibold">{store.name}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          ["Impressions", metrics.impressions],
          ["Spins", metrics.spins],
          ["Coupons", metrics.coupons],
          ["Redemptions", metrics.redemptions],
          ["Rec. impressions", metrics.recommendationImpressions],
          ["Rec. clicks", metrics.recommendationClicks],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}