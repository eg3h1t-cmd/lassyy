import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Sayfa bulunamadı</h1>
      <p className="mt-3 text-sm text-zinc-400">Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.</p>
      <Link
        href="/"
        className="accent-gradient glow-button mt-6 inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold text-white"
      >
        Ana sayfaya dön
      </Link>
    </div>
  );
}