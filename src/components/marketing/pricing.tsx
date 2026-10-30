const modules = [
  { slug: "sans_carki", name: "Şans Çarkı", price: 1750, description: "Etkileşimli indirim çarkı", accent: "from-rose-400 to-orange-400", icon: "🎡" },
  { slug: "wp_sepet_hatirlatma", name: "WhatsApp Sepet Hatırlatma", price: 1250, description: "Otomatik terkedilmiş sepet bildirimi", accent: "from-emerald-400 to-teal-400", icon: "🛒" },
  { slug: "wp_kampanya_toplu", name: "WhatsApp Kampanya Toplu Bildirim", price: 1250, description: "Toplu duyuru ve kampanya gönderimi", accent: "from-amber-400 to-yellow-400", icon: "📣" },
  { slug: "wp_kargo_takip", name: "WhatsApp Kargo Takip", price: 1250, description: "Anlık kargo durum bilgilendirmesi", accent: "from-sky-400 to-cyan-400", icon: "📦" },
  { slug: "akilli_beden", name: "Akıllı Beden Asistanı", price: 2000, description: "Beden öneri asistanı", accent: "from-violet-400 to-fuchsia-400", icon: "📐" },
  { slug: "cikis_niyetli_popup", name: "Çıkış Niyetli Pop-uplar", price: 1000, description: "Ziyaretçi tutma pop-up'ı", accent: "from-fuchsia-400 to-pink-400", icon: "🚪" },
  { slug: "geri_sayim_kampanyalari", name: "Geri Sayım Kampanyaları", price: 1000, description: "Sınırlı süre teklif sayaçları", accent: "from-orange-400 to-amber-400", icon: "⏳" },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-zinc-200 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Modül Fiyatları</h2>
          <p className="mt-2 text-sm text-zinc-600">Abonelik yok. Tek seferlik ödeme.</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div key={m.slug} className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-indigo-300 hover:shadow-md">
              <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${m.accent}`} />
              <div className="flex items-start justify-between">
                <span className="text-xl" aria-hidden="true">{m.icon}</span>
                <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  Tek seferlik
                </span>
              </div>
              <h3 className="mt-3 font-medium text-zinc-900">{m.name}</h3>
              <p className="mt-1 text-sm text-zinc-600">{m.description}</p>
              <p className="mt-4 text-xl font-semibold text-zinc-900">{m.price.toLocaleString("tr-TR")} TL</p>
              <a
                href="/sign-up"
                className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Satın Al
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}