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
    const body = encodeURIComponent(`Ad: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <section id="contact" className="border-t border-zinc-200 bg-white py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">İletişim</h2>
        <p className="mt-2 text-sm text-zinc-600">Destek için bize ulaşın.</p>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              {SUPPORT_EMAIL}
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800">
              Bize Ulaşın
            </a>
          </div>

          <form onSubmit={onSubmit} className="mt-5 grid gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Adınız"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-indigo-400"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="E-posta"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-indigo-400"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
              placeholder="Mesajınız"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-indigo-400 sm:col-span-2"
            />
            <button type="submit" className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 sm:col-span-2">
              E-posta gönder
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}