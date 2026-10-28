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
    <section id="pricing" className="border-t border-zinc-200 py-20 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight">Pricing</h2>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Plan definitions and entitlements are enforced on the server. Payment processing is not
          included in this version.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-6 ${
                p.highlight
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                  : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
              }`}
            >
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-2 text-3xl font-semibold">{p.price}</p>
              <p className={`mt-2 text-sm ${p.highlight ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-600 dark:text-zinc-400"}`}>
                {p.description}
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}