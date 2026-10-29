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
    <section id="faq" className="border-t border-white/[0.06] py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Frequently asked questions</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="surface surface-hover rounded-2xl p-5">
              <h3 className="font-semibold text-white">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}