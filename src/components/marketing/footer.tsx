"use client";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 sm:flex-row sm:px-6">
        <p className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-bold text-white">
            L
          </span>
          © 2026 lassyy. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="/privacy" className="transition-colors hover:text-white">
            Privacy
          </a>
          <a href="/terms" className="transition-colors hover:text-white">
            Terms
          </a>
          <a href="#contact" className="transition-colors hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}