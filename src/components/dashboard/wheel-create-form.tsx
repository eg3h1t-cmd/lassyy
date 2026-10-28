"use client";

import { useState } from "react";
import { createWheelCampaignAction } from "@/server/wheel";

const defaultSegments = [
  { id: "s1", label: "10% off", color: "#ef4444", prizeType: "coupon" as const, discountType: "percentage" as const, discountValue: 10, weight: 40 },
  { id: "s2", label: "15% off", color: "#f59e0b", prizeType: "coupon" as const, discountType: "percentage" as const, discountValue: 15, weight: 25 },
  { id: "s3", label: "Free shipping", color: "#10b981", prizeType: "coupon" as const, discountType: "fixed" as const, discountValue: 0, weight: 20 },
  { id: "s4", label: "Try again", color: "#6b7280", prizeType: "none" as const, weight: 15 },
];

export function WheelCreateForm({ stores }: { stores: { id: string; name: string }[] }) {
  const [storeId, setStoreId] = useState(stores[0]?.id ?? "");
  const [title, setTitle] = useState("Spin to win");
  const [status, setStatus] = useState<"draft" | "active">("draft");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const result = await createWheelCampaignAction({
        storeId,
        config: { title, segments: defaultSegments, spinDurationMs: 4000 },
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
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-3">
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
        placeholder="Campaign title"
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
        className="sm:col-span-3 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {loading ? "Creating..." : "Create wheel campaign"}
      </button>
      {message && <p className="sm:col-span-3 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}
    </form>
  );
}