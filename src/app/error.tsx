"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold text-white">Bir şeyler ters gitti</h1>
      <p className="mt-3 text-sm text-zinc-400">Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.</p>
      <button
        onClick={reset}
        className="accent-gradient glow-button mt-6 inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold text-white"
      >
        Tekrar dene
      </button>
    </div>
  );
}