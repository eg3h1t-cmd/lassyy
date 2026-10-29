const modules = [
  {
    slug: "sans_carki",
    name: "Şans Çarkı",
    price: 1750,
    description: "Sunucu taraflı kupon korumalı ödül çarkı.",
    accent: "from-rose-400 to-orange-400",
    icon: "🎡",
  },
  {
    slug: "wp_sepet_hatirlatma",
    name: "WhatsApp Sepet Hatırlatma",
    price: 1250,
    description: "Terk edilen sepetler için WhatsApp hatırlatma mesajları.",
    accent: "from-emerald-400 to-teal-400",
    icon: "🛒",
  },
  {
    slug: "wp_kampanya_toplu",
    name: "WhatsApp Kampanya Toplu Bildirim",
    price: 1250,
    description: "Kampanya duyurularını WhatsApp üzerinden toplu gönderin.",
    accent: "from-amber-400 to-yellow-400",
    icon: "📣",
  },
  {
    slug: "wp_kargo_takip",
    name: "WhatsApp Kargo Takip",
    price: 1250,
    description: "Kargo durum güncellemelerini WhatsApp ile iletin.",
    accent: "from-sky-400 to-cyan-400",
    icon: "📦",
  },
  {
    slug: "akilli_sepet_onerisi",
    name: "Akıllı Sepet Önerisi",
    price: 1000,
    description: "Sepet tutarına göre dinamik ürün ve kargo avantajları.",
    accent: "from-lime-400 to-emerald-400",
    icon: "🧺",
  },
  {
    slug: "akilli_beden",
    name: "Akıllı Beden Asistanı",
    price: 2000,
    description: "Müşterilere doğru bedeni öneren akıllı asistan.",
    accent: "from-violet-400 to-fuchsia-400",
    icon: "📐",
  },
  {
    slug: "cikis_niyetli_popup",
    name: "Çıkış Niyetli Pop-uplar",
    price: 1000,
    description: "Kullanıcı siteden ayrılmak üzereyken tetiklenen akıllı teklifler.",
    accent: "from-fuchsia-400 to-pink-400",
    icon: "🚪",
  },
  {
    slug: "analitik",
    name: "Analitik",
    price: 1000,
    description: "Gerçek zamanlı ve mağaza odaklı metrik takibi.",
    accent: "from-indigo-400 to-violet-400",
    icon: "📊",
  },
  {
    slug: "geri_sayim_kampanyalari",
    name: "Geri Sayım Kampanyaları",
    price: 1000,
    description: "Güvenli zaman damgalı süre sınırlı kampanyalar.",
    accent: "from-orange-400 to-amber-400",
    icon: "⏳",
  },
  {
    slug: "urun_onerileri",
    name: "Ürün Önerileri",
    price: 1000,
    description: "Gösterim ve tıklama takipli tamamlayıcı ürün setleri.",
    accent: "from-cyan-400 to-sky-400",
    icon: "✨",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/[0.06] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white">Modül Fiyatları</h2>
          <p className="mt-3 text-zinc-400">
            Abonelik yok. İhtiyacınız olan modülleri tek seferlik ödemeyle satın alın, dilediğiniz zaman kullanın.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div key={m.slug} className="surface surface-hover group relative overflow-hidden rounded-2xl p-6">
              <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${m.accent}`} />
              <div className="flex items-start justify-between">
                <span className="text-2xl" aria-hidden="true">{m.icon}</span>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400 ring-1 ring-white/10">
                  Tek seferlik
                </span>
              </div>
              <h3 className="mt-3 font-semibold text-white">{m.name}</h3>
              <p className="mt-1 min-h-10 text-sm text-zinc-400">{m.description}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{m.price.toLocaleString("tr-TR")} TL</p>
              <a
                href="/sign-up"
                className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm font-semibold text-zinc-100 transition-colors hover:border-indigo-400/40 hover:bg-white/[0.06]"
              >
                Satın Al
              </a>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          Modüller tek tek satın alınır. Ödeme onayından sonra ilgili modül mağazanızda aktifleşir.
        </p>
      </div>
    </section>
  );
}