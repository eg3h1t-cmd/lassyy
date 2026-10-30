import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Genel Bakış" },
  { href: "/dashboard/modules", label: "Modüller" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight text-zinc-900">
            <span className="accent-gradient inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white">
              L
            </span>
            lassyy
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" aria-label="Panel">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-zinc-600 transition-colors hover:text-zinc-900">
                {link.label}
              </Link>
            ))}
            <Link href="/demo" className="text-indigo-600 transition-colors hover:text-indigo-700">
              Demo Vitrin
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-white">{children}</main>
    </>
  );
}