const faqs = [
  {
    q: "Abonelik var mı?",
    a: "Hayır. Modüller tek seferlik ödemeyle satın alınır.",
  },
  {
    q: "WhatsApp mesajları nasıl gönderiliyor?",
    a: "Meta WhatsApp Cloud API ve onaylı mesaj şablonları üzerinden.",
  },
  {
    q: "Modülleri ayrı ayrı alabilir miyim?",
    a: "Evet. Her modül bağımsızdır ve tek tek satın alınır.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-zinc-200 bg-white py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Sıkça Sorulan Sorular</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl border border-zinc-200 bg-white p-4">
              <h3 className="text-sm font-medium text-zinc-900">{f.q}</h3>
              <p className="mt-1 text-sm text-zinc-600">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}