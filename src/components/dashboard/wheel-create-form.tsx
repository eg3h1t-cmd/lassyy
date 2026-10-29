"use client";

import { useState } from "react";
import { createWheelCampaignAction } from "@/server/wheel";

const defaultSegments = [
  { id: "s1", label: "%10 indirim", color: "#ef4444", prizeType: "coupon" as const, discountType: "percentage" as const, discountValue: 10, weight: 40 },
  { id: "s2", label: "%15 indirim", color: "#f59e0b", prizeType: "coupon" as const, discountType: "percentage" as const, discountValue: 15, weight: 25 },
  { id: "s3", label: "Ücretsiz kargo", color: "#10b981", prizeType: "coupon" as const, discountType: "fixed" as const, discountValue: 0, weight: 20 },
  { id: "s4", label: "Tekrar dene", color: "#6b7280", prizeType: "none" as const, weight: 15 },
];

export function WheelCreateForm({ stores }: { stores: { id: string; name: string }[] }) {
  const [storeId, setStoreId] = useState(stores[0]?.id ?? "");
  const [title, setTitle] = useState("Çevir kazan");
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
      else setMessage(`Kampanya oluşturuldu (${result.campaignId}).`);
    } catch {
      setMessage("Kampanya oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (stores.length === 0) return <p className="mt-3 text-sm text-zinc-500">Önce bir mağaza oluşturun.</p>;

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-3">
      <select
        value={storeId}
        onChange={(e) => setStoreId(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-indigo-400/50"
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
        placeholder="Kampanya başlığı"
        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-indigo-400/50"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as "draft" | "active")}
        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-indigo-400/50"
      >
        <option value="draft">Taslak</option>
        <option value="active">Etkin</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="sm:col-span-3 accent-gradient glow-button rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Oluşturuluyor..." : "Çark kampanyası oluştur"}
      </button>
      {message && <p className="sm:col-span-3 text-sm text-zinc-400">{message}</p>}
    </form>
  );
}