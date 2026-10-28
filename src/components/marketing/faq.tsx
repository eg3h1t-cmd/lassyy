const faqs = [
  {
    q: "Is this connected to my real store yet?",
    a: "The first version includes a controlled demo storefront. Real store integrations are documented as future work.",
  },
  {
    q: "How is tenant data protected?",
    a: "Supabase Row Level Security policies and server-side authorization checks enforce per-store isolation.",
  },
  {
    q: "Can I run it locally?",
    a: "Yes. Follow the setup instructions in README.md. Supabase credentials are required for auth and persistence.",
  },
  {
    q: "Are payments supported?",
    a: "No. Subscription readiness is modeled, but no payment provider is integrated in this version.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-zinc-200 py-20 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight">Frequently asked questions</h2>
        <div className="mt-8 space-y-6">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}