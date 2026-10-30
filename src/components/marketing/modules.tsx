const modules = [
  { name: "Şans Çarkı", description: "Etkileşimli indirim çarkı.", accent: "from-rose-400 to-orange-400", glow: "bg-rose-500/10", icon: "🎡" },
  { name: "WhatsApp Sepet Hatırlatma", description: "Otomatik terkedilmiş sepet bildirimi.", accent: "from-emerald-400 to-teal-400", glow: "bg-emerald-500/10", icon: "🛒" },
  { name: "WhatsApp Kampanya Toplu Bildirim", description: "Toplu duyuru ve kampanya gönderimi.", accent: "from-amber-400 to-yellow-400", glow: "bg-amber-500/10", icon: "📣" },
  { name: "WhatsApp Kargo Takip", description: "Anlık kargo durum bilgilendirmesi.", accent: "from-sky-400 to-cyan-400", glow: "bg-sky-500/10", icon: "📦" },
  { name: "Akıllı Beden Asistanı", description: "Beden öneri asistanı.", accent: "from-violet-400 to-fuchsia-400", glow: "bg-violet-500/10", icon: "📐" },
  { name: "Çıkış Niyetli Pop-uplar", description: "Ziyaretçi tutma pop-up'ı.", accent: "from-fuchsia-400 to-pink-400", glow: "bg-fuchsia-500/10", icon: "🚪" },
  { name: "Geri Sayım Kampanyaları", description: "Sınırlı süre teklif sayaçları.", accent: "from-orange-400 to-amber-400", glow: "bg-orange-500/10", icon: "⏳" },
];

export function Modules() {
  return (
    <section id="modules" className="border-t border-zinc-200 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Modüller</h2>
        <p className="mt-2 max-w-xl text-sm text-zinc-600">Tekil satın alınan, bağımsız büyüme eklentileri.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div key={m.name} className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-indigo-300 hover:shadow-md">
              <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${m.accent}`} />
              <div className="flex items-center gap-3">
                <span className="text-xl" aria-hidden="true">{m.icon}</span>
                <h3 className="font-medium text-zinc-900">{m.name}</h3>
              </div>
              <p className="mt-2 text-sm text-zinc-600">{m.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}