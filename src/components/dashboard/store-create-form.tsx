"use client";

import { useState } from "react";
import { createStoreAction } from "@/server/stores";

export function StoreCreateForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const result = await createStoreAction({ name, slug });
      if (!result.ok) {
        setMessage(result.error);
      } else {
        setMessage("Mağaza oluşturuldu.");
        setName("");
        setSlug("");
      }
    } catch {
      setMessage("Mağaza oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-3">
      <input
        placeholder="Mağaza adı"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-indigo-400/50"
      />
      <input
        placeholder="magaza-slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-indigo-400/50"
      />
      <button
        type="submit"
        disabled={loading}
        className="accent-gradient glow-button rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Oluşturuluyor..." : "Mağaza oluştur"}
      </button>
      {message && <p className="sm:col-span-3 text-sm text-zinc-400">{message}</p>}
    </form>
  );
}