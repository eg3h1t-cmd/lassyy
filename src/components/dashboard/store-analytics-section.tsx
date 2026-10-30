import Link from "next/link";
import { getStoreAnalytics } from "@/server/analytics";

export async function StoreAnalyticsSection({
  store,
  days = 30,
}: {
  store: { id: string; name: string; slug?: string };
  days?: number;
}) {
  const metrics = await getStoreAnalytics(store.id, days);

  if (!metrics.allowed) {
    return (
      <section className="surface rounded-2xl p-6">
        <h2 className="font-semibold text-zinc-900">{store.name}</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Analitik modülü bu mağaza için aktif değil. Modülü satın alarak metrikleri görebilirsiniz.
        </p>
        {store.slug && (
          <Link
            href={`/dashboard/${store.slug}/store`}
            className="accent-gradient glow-button mt-4 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white"
          >
            Modül mağazasına git
          </Link>
        )}
      </section>
    );
  }

  const basic = [
    ["Gösterimler", metrics.impressions],
    ["Çevirmeler", metrics.spins],
    ["Kuponlar", metrics.coupons],
    ["Kullanımlar", metrics.redemptions],
  ] as const;
  const advanced = [
    ["Öneri gösterimleri", metrics.recommendationImpressions],
    ["Öneri tıklamaları", metrics.recommendationClicks],
    ["Kupon kullanım oranı", `${metrics.redemptionRate}%`],
  ] as const;

  return (
    <section className="surface rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-zinc-900">{store.name}</h2>
        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
          Son {days} gün
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {basic.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">{value}</p>
          </div>
        ))}
      </div>

      {metrics.advanced ? (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {advanced.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-indigo-400/15 bg-indigo-400/[0.04] p-4">
              <p className="text-xs text-indigo-700/70">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-zinc-200 p-4 text-xs text-zinc-500">
          Gelişmiş analitik Pro / Premium ve Kurumsal planlarda kullanılabilir.
        </p>
      )}
    </section>
  );
}