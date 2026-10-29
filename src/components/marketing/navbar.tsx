import Link from "next/link";

const nav = [
  { href: "#features", label: "Features" },
  { href: "#modules", label: "Modules" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5 font-semibold tracking-tight text-white">
          <span className="accent-gradient glow-button inline-flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold text-white transition-transform group-hover:scale-105">
            L
          </span>
          <span className="text-[1.05rem]">
            lassyy
            <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-indigo-400 align-middle shadow-[0_0_10px_rgba(129,140,248,0.9)]" />
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-sm text-zinc-400 transition-colors hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-indigo-400 after:to-violet-400 after:transition-all hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="accent-gradient glow-button inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}