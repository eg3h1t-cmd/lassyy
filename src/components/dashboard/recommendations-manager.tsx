"use client";

import { useState } from "react";
import { setRecommendationConfigAction } from "@/server/recommendations";
import type { RecommendationProduct } from "@/server/recommendations";

export function RecommendationsManager({
  storeId,
  initial,
}: {
  storeId: string;
  initial: RecommendationProduct[];
}) {
  const [products, setProducts] = useState<RecommendationProduct[]>(initial);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function add() {
    if (!name.trim()) return;
    setProducts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: name.trim(), imageUrl: imageUrl.trim(), url: url.trim() },
    ]);
    setName("");
    setImageUrl("");
    setUrl("");
  }

  function remove(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function save() {
    setLoading(true);
    setMessage(null);
    try {
      const result = await setRecommendationConfigAction({ storeId, products });
      if (result.ok) setMessage("Kaydedildi.");
      else setMessage(result.error);
    } catch {
      setMessage("Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-4">
        <input
          placeholder="Ürün adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-indigo-400/50"
        />
        <input
          placeholder="Görsel URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-indigo-400/50"
        />
        <input
          placeholder="Ürün URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-indigo-400/50"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white/10"
        >
          Ekle
        </button>
      </div>

      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm">
            <span className="text-zinc-200">{p.name}</span>
            <button onClick={() => remove(p.id)} className="text-red-400 transition-colors hover:text-red-600">
              Kaldır
            </button>
          </li>
        ))}
        {products.length === 0 && <li className="text-sm text-zinc-500">Henüz ürün eklenmedi.</li>}
      </ul>

      <button
        type="button"
        onClick={save}
        disabled={loading}
        className="accent-gradient glow-button rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Kaydediliyor..." : "Önerileri kaydet"}
      </button>
      {message && <p className="text-sm text-zinc-600">{message}</p>}
    </div>
  );
}