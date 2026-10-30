import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              E-ticaret için büyüme eklentileri
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Satışınızı artıran <span className="accent-text">hazır modüller</span>.
            </h1>
            <p className="mt-4 max-w-lg text-base text-zinc-600">
              WhatsApp bildirimleri, indirim çarkı ve dönüşüm araçları. Tekil satın alın, hemen kullanın.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="accent-gradient inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold text-white">
                Hemen başla
              </Link>
              <a href="#modules" className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
                Modülleri gör
              </a>
            </div>
            <p className="mt-3 text-xs text-zinc-500">Abonelik yok. Tek seferlik ödeme.</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-700">Modül durumu</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Aktif</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["WhatsApp Sepet", "Kargo Takip", "Şans Çarkı", "Beden Asistanı"].map((label) => (
                <div key={label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <p className="text-xs text-zinc-500">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">Aktif</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-zinc-500">Örnek panel görünümü.</p>
          </div>
        </div>
      </div>
    </section>
  );
}