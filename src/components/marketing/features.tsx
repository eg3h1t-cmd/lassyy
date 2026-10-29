const features = [
  {
    title: "Çok kiracılı mağazalar",
    description: "Her mağazanın verisi satır düzeyi güvenlik ve sunucu taraflı sahiplik doğrulamasıyla izole edilir.",
    accent: "from-indigo-400 to-violet-400",
  },
  {
    title: "Kampanya yönetimi",
    description: "Promosyon kampanyalarını denetim izleriyle oluşturun, planlayın, etkinleştirin, duraklatın ve arşivleyin.",
    accent: "from-sky-400 to-cyan-400",
  },
  {
    title: "Pazarlama widget'ları",
    description: "İndirim çarklarını, önerileri ve geri sayımları canlı önizlemelerle yapılandırın.",
    accent: "from-fuchsia-400 to-pink-400",
  },
  {
    title: "Kupon motoru",
    description: "Sunucu taraflı doğrulanan kupon üretimi, son kullanma, kullanım limitleri ve kullanım takibi.",
    accent: "from-emerald-400 to-teal-400",
  },
  {
    title: "Analitik",
    description: "Gösterimleri, etkileşimleri, kupon üretimini ve kullanımlarını gerçek kayıtlı olaylardan takip edin.",
    accent: "from-amber-400 to-orange-400",
  },
  {
    title: "Ekip erişimi",
    description: "Kapsamlı izinlerle ekip arkadaşlarınızı davet edin ve hassas mağaza ayarlarını koruyun.",
    accent: "from-rose-400 to-red-400",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-white/[0.06] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Promosyonlarınızı yönetmek için ihtiyacınız olan her şey</h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Yapılandırma, render, kupon mantığı ve analitiği birbirinden net şekilde ayıran modüler bir platform.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="surface surface-hover group rounded-2xl p-6">
              <span className={`mb-4 block h-1 w-10 rounded-full bg-gradient-to-r ${f.accent} transition-all group-hover:w-16`} />
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}