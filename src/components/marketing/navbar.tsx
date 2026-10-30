import Link from "next/link";

const nav = [
  { href: "#features", label: "Özellikler" },
  { href: "#modules", label: "Modüller" },
  { href: "#pricing", label: "Fiyatlar" },
  { href: "#faq", label: "SSS" },
  { href: "#contact", label: "İletişim" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-zinc-900">
          <span className="accent-gradient inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white">
            L
          </span>
          lassyy
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Ana menü">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-zinc-600 transition-colors hover:text-zinc-900">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/sign-in" className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
            Giriş Yap
          </Link>
          <Link href="/sign-up" className="accent-gradient inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white">
            Ücretsiz Başla
          </Link>
        </div>
      </div>
    </header>
  );
}