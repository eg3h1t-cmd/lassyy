const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For development and small stores.",
    features: ["1 store", "Basic widgets", "Community support"],
  },
  {
    name: "Growth",
    price: "Contact",
    description: "For growing e-commerce teams.",
    features: ["Multiple stores", "All modules", "Priority support", "Higher usage limits"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For advanced requirements.",
    features: ["Custom limits", "Dedicated support", "Integration assistance", "SLA options"],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/[0.06] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Pricing</h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Plan definitions and entitlements are enforced on the server. Payment processing is not
          included in this version.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl p-6 ${
                p.highlight
                  ? "relative overflow-hidden border border-indigo-400/30 bg-gradient-to-b from-indigo-500/[0.12] to-violet-500/[0.04] shadow-[0_0_60px_-20px_rgba(99,102,241,0.6)]"
                  : "surface surface-hover"
              }`}
            >
              {p.highlight && (
                <span className="absolute right-4 top-4 rounded-full bg-indigo-400/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-200 ring-1 ring-indigo-400/30">
                  Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <p className="mt-2 text-3xl font-semibold text-white">{p.price}</p>
              <p className="mt-2 text-sm text-zinc-400">{p.description}</p>
              <ul className="mt-6 space-y-2 text-sm text-zinc-300">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}