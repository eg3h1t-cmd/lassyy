const modules = [
  {
    name: "Çarkıfelek İndirimi",
    description: "Sunucu taraflı kupon korumalı ödül çarkı.",
    accent: "from-rose-400 to-orange-400",
    glow: "bg-rose-500/10",
  },
  {
    name: "Ürün Önerileri",
    description: "Gösterim ve tıklama takipli tamamlayıcı ürün setleri.",
    accent: "from-sky-400 to-indigo-400",
    glow: "bg-sky-500/10",
  },
  {
    name: "Geri Sayım Kampanyaları",
    description: "Güvenli zaman damgalı süre sınırlı kampanyalar.",
    accent: "from-emerald-400 to-cyan-400",
    glow: "bg-emerald-500/10",
  },
  {
    name: "Analitik",
    description: "Gerçek zamanlı ve mağaza odaklı metrik takibi.",
    accent: "from-violet-400 to-fuchsia-400",
    glow: "bg-violet-500/10",
  },
  {
    name: "Çıkış Niyetli Pop-uplar",
    description: "Kullanıcı siteden ayrılmak üzereyken tetiklenen akıllı teklifler.",
    accent: "from-fuchsia-400 to-pink-400",
    glow: "bg-fuchsia-500/10",
  },
  {
    name: "Akıllı Sepet Önerileri",
    description: "Sepet tutarına göre dinamik ürün ve kargo avantajları.",
    accent: "from-amber-400 to-emerald-400",
    glow: "bg-amber-500/10",
  },
];

export function Modules() {
  return (
    <section id="modules" className="border-t border-white/[0.06] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Pazarlama Modülleri</h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Her biri kendi yapılandırmasına, yetkilendirmesine ve testlerine sahip altı bağımsız modül.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div key={m.name} className="surface surface-hover group relative overflow-hidden rounded-2xl p-6">
              <div className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full ${m.glow} blur-2xl transition-opacity duration-300 group-hover:opacity-100`} />
              <div className="flex items-center gap-3">
                <span className={`h-8 w-1 rounded-full bg-gradient-to-b ${m.accent}`} />
                <h3 className="font-semibold text-white">{m.name}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{m.description}</p>
              <div className={`mt-4 h-px w-full bg-gradient-to-r ${m.accent} opacity-30 transition-opacity group-hover:opacity-70`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}