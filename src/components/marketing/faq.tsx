const faqs = [
  {
    q: "Gerçek mağazama bağlı mı?",
    a: "İlk sürüm kontrollü bir demo vitrin içeriyor. Gerçek mağaza entegrasyonları gelecek çalışmalar olarak belgelenmiştir.",
  },
  {
    q: "Mağaza verilerim nasıl korunuyor?",
    a: "Supabase Satır Düzeyi Güvenlik politikaları ve sunucu taraflı yetkilendirme kontrolleri mağaza bazında izolasyonu sağlar.",
  },
  {
    q: "Yerelde çalıştırabilir miyim?",
    a: "Evet. README.md dosyasındaki kurulum adımlarını izleyin. Kimlik doğrulama ve kalıcı veri için Supabase bilgileri gereklidir.",
  },
  {
    q: "Ödeme desteği var mı?",
    a: "Hayır. Abonelik altyapısı modellendi ancak bu sürümde gerçek bir ödeme sağlayıcısı entegre edilmedi.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-white/[0.06] py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Sıkça Sorulan Sorular</h2>
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