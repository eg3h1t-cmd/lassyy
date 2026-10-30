const steps = [
  "Hesap oluşturun ve mağazanızı ekleyin.",
  "İhtiyacınız olan modülü satın alın.",
  "Modülü yapılandırın ve kullanmaya başlayın.",
];

export function HowItWorks() {
  return (
    <section className="border-t border-zinc-200 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Nasıl çalışır?</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step} className="rounded-xl border border-zinc-200 bg-white p-5">
              <span className="text-xs font-semibold text-indigo-600">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-sm text-zinc-700">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}