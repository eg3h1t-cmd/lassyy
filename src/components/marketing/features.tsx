const features = [
  {
    title: "Multi-tenant stores",
    description: "Each store's data is isolated with row-level security and server-verified ownership.",
  },
  {
    title: "Campaign management",
    description: "Create, schedule, activate, pause, and archive promotional campaigns with audit trails.",
  },
  {
    title: "Marketing widgets",
    description: "Configure discount wheels, recommendations, and countdowns with live previews.",
  },
  {
    title: "Coupon engine",
    description: "Server-validated coupon issuance, expiry, usage limits, and redemption tracking.",
  },
  {
    title: "Analytics",
    description: "Track impressions, interactions, issuance, and redemptions from real stored events.",
  },
  {
    title: "Team access",
    description: "Invite staff with scoped permissions and protect sensitive store settings.",
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
            <div
              key={f.title}
              className="surface surface-hover rounded-2xl p-6"
            >
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}