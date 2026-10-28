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
        setMessage("Store created.");
        setName("");
        setSlug("");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to create store.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-3">
      <input
        placeholder="Store name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <input
        placeholder="store-slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {loading ? "Creating..." : "Create store"}
      </button>
      {message && <p className="sm:col-span-3 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}
    </form>
  );
}