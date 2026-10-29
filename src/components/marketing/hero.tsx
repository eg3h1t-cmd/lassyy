import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.06] px-3 py-1 text-xs font-medium text-indigo-200">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.9)]" />
              Built for e-commerce teams
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Grow store revenue with{" "}
              <span className="accent-text">smarter promotions</span> and engagement.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              lassyy helps e-commerce businesses run promotional campaigns, manage
              marketing widgets, and measure engagement from one secure, multi-tenant
              dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="accent-gradient glow-button inline-flex h-12 items-center justify-center rounded-xl px-6 text-base font-semibold text-white"
              >
                Start free trial
              </Link>
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-6 text-base font-medium text-zinc-200 transition-colors hover:border-indigo-400/40 hover:bg-white/[0.05]"
              >
                See features
              </a>
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              No credit card required. Free tier available for development and small stores.
            </p>
          </div>
          <div className="relative float-slow">
            <div className="surface rounded-2xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-200">Campaign overview</span>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/20">
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
                  <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-colors hover:border-indigo-400/25">
                    <p className="text-xs text-zinc-500">{label}</p>
                    <p className="mt-1 text-xl font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-dashed border-white/10 p-4 text-xs text-zinc-500">
                Sample dashboard preview. Real metrics come from stored analytics events.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}