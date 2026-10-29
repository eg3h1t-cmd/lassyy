const features = [
  {
    title: "Multi-tenant stores",
    description: "Each store's data is isolated with row-level security and server-verified ownership.",
    accent: "from-indigo-400 to-violet-400",
  },
  {
    title: "Campaign management",
    description: "Create, schedule, activate, pause, and archive promotional campaigns with audit trails.",
    accent: "from-sky-400 to-cyan-400",
  },
  {
    title: "Marketing widgets",
    description: "Configure discount wheels, recommendations, and countdowns with live previews.",
    accent: "from-fuchsia-400 to-pink-400",
  },
  {
    title: "Coupon engine",
    description: "Server-validated coupon issuance, expiry, usage limits, and redemption tracking.",
    accent: "from-emerald-400 to-teal-400",
  },
  {
    title: "Analytics",
    description: "Track impressions, interactions, issuance, and redemptions from real stored events.",
    accent: "from-amber-400 to-orange-400",
  },
  {
    title: "Team access",
    description: "Invite staff with scoped permissions and protect sensitive store settings.",
    accent: "from-rose-400 to-red-400",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-white/[0.06] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Everything you need to run promotions</h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          A modular platform that keeps configuration, rendering, coupon logic, and analytics clearly separated.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="surface surface-hover group rounded-2xl p-6">
              <span className={`mb-4 block h-1 w-10 rounded-full bg-gradient-to-r ${f.accent} transition-all group-hover:w-16`} />
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}