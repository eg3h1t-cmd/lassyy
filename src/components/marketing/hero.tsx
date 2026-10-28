import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              Built for e-commerce teams
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Grow store revenue with smarter promotions and engagement.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              PromoNest helps e-commerce businesses run promotional campaigns, manage
              marketing widgets, and measure engagement from one secure, multi-tenant
              dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-6 text-base font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Start free trial
              </Link>
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-300 px-6 text-base font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                See features
              </a>
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              No credit card required. Free tier available for development and small stores.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium">Campaign overview</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  Live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Impressions", "—"],
                  ["Interactions", "—"],
                  ["Coupons issued", "—"],
                  ["Redemptions", "—"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <p className="text-xs text-zinc-500">{label}</p>
                    <p className="mt-1 text-xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-dashed border-zinc-300 p-4 text-xs text-zinc-500 dark:border-zinc-700">
                Sample dashboard preview. Real metrics come from stored analytics events.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}