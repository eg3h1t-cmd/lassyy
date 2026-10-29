"use client";

import { useState } from "react";
import { createCountdownCampaignAction } from "@/server/countdown";

export function CountdownCreateForm({ stores }: { stores: { id: string; name: string }[] }) {
  const [storeId, setStoreId] = useState(stores[0]?.id ?? "");
  const [title, setTitle] = useState("Süreli teklif");
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
      else setMessage(`Kampanya oluşturuldu (${result.campaignId}).`);
    } catch {
      setMessage("Kampanya oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (stores.length === 0) return <p className="mt-3 text-sm text-zinc-500">Önce bir mağaza oluşturun.</p>;

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
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
        placeholder="Başlık"
        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-indigo-400/50"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Açıklama"
        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-indigo-400/50"
      />
      <input
        type="datetime-local"
        value={endsAt}
        onChange={(e) => setEndsAt(e.target.value)}
        className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-indigo-400/50"
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
        className="accent-gradient glow-button rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Oluşturuluyor..." : "Geri sayım oluştur"}
      </button>
      {message && <p className="sm:col-span-2 text-sm text-zinc-400">{message}</p>}
    </form>
  );
}