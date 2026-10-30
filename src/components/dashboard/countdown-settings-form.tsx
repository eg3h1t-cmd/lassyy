"use client";

import { useState } from "react";
import { saveCountdownSettingsAction } from "@/server/countdown";
import type { CountdownConfig } from "@/lib/validations/countdown";

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function CountdownSettingsForm({
  storeId,
  initialConfig,
  initialStatus,
}: {
  storeId: string;
  initialConfig: CountdownConfig;
  initialStatus: string;
}) {
  const [title, setTitle] = useState(initialConfig.title);
  const [description, setDescription] = useState(initialConfig.description ?? "");
  const [endsAt, setEndsAt] = useState(toLocalInput(initialConfig.endsAt));
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save() {
    setMessage(null);
    setLoading(true);
    try {
      const result = await saveCountdownSettingsAction({
        storeId,
        config: {
          title,
          description,
          endsAt: new Date(endsAt).toISOString(),
          startsAt: initialConfig.startsAt ?? null,
        },
        status,
      });
      setMessage(result.ok ? "Geri sayım ayarları kaydedildi." : result.error);
    } catch {
      setMessage("Kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="font-medium text-zinc-200">Kampanya başlığı</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none focus:border-indigo-400/50"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-zinc-200">Bitiş tarihi ve saati</span>
          <input
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none focus:border-indigo-400/50"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-zinc-200">Banner metni</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none focus:border-indigo-400/50"
        />
      </label>

      <label className="block max-w-xs text-sm">
        <span className="font-medium text-zinc-200">Durum</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none focus:border-indigo-400/50"
        >
          <option value="draft">Taslak</option>
          <option value="active">Etkin</option>
          <option value="paused">Duraklatıldı</option>
          <option value="archived">Arşivlendi</option>
        </select>
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={loading}
          className="accent-gradient glow-button rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Geri sayım ayarlarını kaydet"}
        </button>
        {message && <p className="text-sm text-zinc-600">{message}</p>}
      </div>
    </div>
  );
}