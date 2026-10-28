"use client";

import { useState } from "react";
import { createCountdownCampaignAction } from "@/server/countdown";

export function CountdownCreateForm({ stores }: { stores: { id: string; name: string }[] }) {
  const [storeId, setStoreId] = useState(stores[0]?.id ?? "");
  const [title, setTitle] = useState("Limited time offer");
  const [description, setDescription] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [status, setStatus] = useState<"draft" | "active">("draft");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const result = await createCountdownCampaignAction({
        storeId,
        title,
        description,
        endsAt: new Date(endsAt).toISOString(),
        status,
      });
      if (!result.ok) setMessage(result.error);
      else setMessage(`Campaign created (${result.campaignId}).`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed.");
    } finally {
      setLoading(false);
    }
  }

  if (stores.length === 0) return <p className="mt-3 text-sm text-zinc-500">Create a store first.</p>;

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
      <select
        value={storeId}
        onChange={(e) => setStoreId(e.target.value)}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        {stores.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <input
        type="datetime-local"
        value={endsAt}
        onChange={(e) => setEndsAt(e.target.value)}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as "draft" | "active")}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      >
        <option value="draft">Draft</option>
        <option value="active">Active</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {loading ? "Creating..." : "Create countdown"}
      </button>
      {message && <p className="sm:col-span-2 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}
    </form>
  );
}