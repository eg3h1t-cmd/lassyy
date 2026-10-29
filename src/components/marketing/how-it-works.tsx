const steps = [
  "Hesabınızı oluşturun ve e-postanızı doğrulayın.",
  "Bir mağaza oluşturun ve ihtiyacınız olan modülleri seçin.",
  "Kampanyaları, ödülleri ve görüntüleme kurallarını yapılandırın.",
  "Widget'ları demo vitrinde önizleyin.",
  "Kampanyaları etkinleştirin ve analitiği izleyin.",
];

export function HowItWorks() {
  return (
    <section className="border-t border-white/[0.06] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Nasıl çalışır?</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s} className="surface surface-hover rounded-2xl p-5">
              <span className="text-sm font-semibold text-indigo-300">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-sm text-zinc-300">{s}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}