const modules = [
  {
    name: "Discount Spin Wheel",
    description: "Configurable prize wheel with server-issued coupons and abuse prevention.",
    accent: "from-rose-400 to-orange-400",
  },
  {
    name: "Product Recommendations",
    description: "Manual complementary product sets with impression and click tracking.",
    accent: "from-sky-400 to-indigo-400",
  },
  {
    name: "Countdown Campaigns",
    description: "Time-bound campaigns with trusted server timestamps and expiry handling.",
    accent: "from-emerald-400 to-cyan-400",
  },
  {
    name: "Analytics",
    description: "Store-scoped metrics from real events, with sensible date filters and empty states.",
    accent: "from-violet-400 to-fuchsia-400",
  },
];

export function Modules() {
  return (
    <section id="modules" className="border-t border-white/[0.06] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Marketing modules</h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Each module is an independent feature with its own configuration, authorization, and tests.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {modules.map((m) => (
            <div key={m.name} className="surface surface-hover group rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <span className={`h-8 w-1 rounded-full bg-gradient-to-b ${m.accent}`} />
                <h3 className="font-semibold text-white">{m.name}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{m.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}