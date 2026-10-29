"use client";

import { useState } from "react";

const SUPPORT_EMAIL = "eg3h1t@gmail.com";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`lassyy destek talebi — ${name || "ziyaretçi"}`);
    const body = encodeURIComponent(
      `Ad: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`,
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <section id="contact" className="relative border-t border-white/[0.06] py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-40 max-w-3xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-sky-400/10 blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Destek</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">İletişim</h2>
          <p className="mx-auto mt-3 max-w-xl text-zinc-400">
            Kurulum, güvenlik veya entegrasyonlarla ilgili sorularınız mı var? Mesaj gönderin, sonraki adımı birlikte planlayalım.
          </p>
        </div>

        <div className="surface mt-8 rounded-2xl p-6">
          <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-indigo-400/15 bg-indigo-400/[0.04] p-4 sm:flex-row">
            <div>
              <p className="text-xs text-zinc-400">Doğrudan e-posta</p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-sm font-semibold text-indigo-200 transition-colors hover:text-indigo-100"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="accent-gradient glow-button inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white"
            >
              Bize Ulaşın
            </a>
          </div>

          <form onSubmit={onSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="font-medium text-zinc-300">Adınız</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-indigo-400/50"
                placeholder="Adınız Soyadınız"
              />
            </label>
            <label className="text-sm">
              <span className="font-medium text-zinc-300">E-posta</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-indigo-400/50"
                placeholder="ornek@eposta.com"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="font-medium text-zinc-300">Mesajınız</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-indigo-400/50"
                placeholder="Size nasıl yardımcı olabiliriz?"
              />
            </label>
            <button
              type="submit"
              className="accent-gradient glow-button inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold text-white sm:col-span-2"
            >
              E-posta gönder
            </button>
            <p className="text-xs text-zinc-500 sm:col-span-2">
              Gönder’e bastığınızda e-posta istemciniz mesaj önceden doldurulmuş şekilde açılır. Bu sitede veri saklanmaz.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}