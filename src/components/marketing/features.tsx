const features = [
  {
    title: "Tekil satın alma",
    description: "İhtiyacınız olan modülü seçin, abonelik olmadan kullanın.",
    accent: "from-indigo-400 to-violet-400",
  },
  {
    title: "WhatsApp entegrasyonu",
    description: "Sepet, kampanya ve kargo bildirimlerini otomatikleştirin.",
    accent: "from-emerald-400 to-teal-400",
  },
  {
    title: "Güvenli altyapı",
    description: "Mağaza bazlı yetkilendirme ve sunucu taraflı doğrulama.",
    accent: "from-sky-400 to-cyan-400",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-zinc-200 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Neden lassyy?</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-indigo-300">
              <span className={`block h-1 w-10 rounded-full bg-gradient-to-r ${f.accent}`} />
              <h3 className="mt-4 font-medium text-zinc-900">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}