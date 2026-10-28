"use client";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-10 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 sm:flex-row sm:px-6">
        <p>© 2026 PromoNest. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Privacy
          </a>
          <a href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Terms
          </a>
          <a href="#contact" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}