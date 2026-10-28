const steps = [
  "Create your account and verify your email.",
  "Create a store and choose the modules you need.",
  "Configure campaigns, prizes, and display rules.",
  "Preview widgets in the demo storefront.",
  "Activate campaigns and monitor analytics.",
];

export function HowItWorks() {
  return (
    <section className="border-t border-zinc-200 py-20 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li
              key={s}
              className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <span className="text-sm font-semibold text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-sm">{s}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}