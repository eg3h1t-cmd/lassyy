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
      if (result.ok) setMessage("Saved.");
      else setMessage(result.error);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-4">
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          placeholder="Product URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-zinc-200 px-3 py-2 text-sm font-medium hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <span>{p.name}</span>
            <button onClick={() => remove(p.id)} className="text-red-600 hover:underline dark:text-red-400">
              Remove
            </button>
          </li>
        ))}
        {products.length === 0 && <li className="text-sm text-zinc-500">No products yet.</li>}
      </ul>

      <button
        type="button"
        onClick={save}
        disabled={loading}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {loading ? "Saving..." : "Save recommendations"}
      </button>
      {message && <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}
    </div>
  );
}