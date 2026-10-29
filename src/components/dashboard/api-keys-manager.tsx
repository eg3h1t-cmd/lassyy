"use client";

import { useState } from "react";
import { createApiKeyAction, revokeApiKeyAction, type ApiKeyRow } from "@/server/api-keys";

export function ApiKeysManager({ storeId, initial }: { storeId: string; initial: ApiKeyRow[] }) {
  const [keys, setKeys] = useState(initial);
  const [name, setName] = useState("Entegrasyon");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function create() {
    setMessage(null);
    setNewKey(null);
    setLoading(true);
    const result = await createApiKeyAction({ storeId, name });
    if (result.ok) {
      setNewKey(result.key);
      setMessage("API anahtarı oluşturuldu. Bu anahtarı şimdi kopyalayın; tekrar gösterilmeyecek.");
    } else {
      setMessage(result.error);
    }
    setLoading(false);
  }

  async function revoke(id: string) {
    const result = await revokeApiKeyAction({ id });
    if (result.ok) setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, revoked_at: new Date().toISOString() } : k)));
    else setMessage(result.error);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Anahtar adı"
          className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-indigo-400/50"
        />
        <button
          onClick={create}
          disabled={loading}
          className="accent-gradient glow-button rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Oluşturuluyor..." : "API anahtarı oluştur"}
        </button>
      </div>

      {newKey && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
          <p className="text-xs text-emerald-200">Yeni API anahtarı (yalnızca bir kez gösterilir)</p>
          <code className="mt-2 block break-all font-mono text-sm text-white">{newKey}</code>
        </div>
      )}
      {message && <p className="text-sm text-zinc-400">{message}</p>}

      <ul className="divide-y divide-white/[0.06]">
        {keys.map((key) => (
          <li key={key.id} className="flex items-center justify-between py-3 text-sm">
            <div>
              <p className="text-zinc-200">{key.name}</p>
              <p className="text-xs text-zinc-500">
                {key.key_prefix}… — {key.revoked_at ? "iptal edildi" : "aktif"}
              </p>
            </div>
            {!key.revoked_at && (
              <button onClick={() => revoke(key.id)} className="text-xs text-red-400 hover:text-red-300">
                İptal et
              </button>
            )}
          </li>
        ))}
        {keys.length === 0 && <li className="py-3 text-sm text-zinc-500">Henüz API anahtarı yok.</li>}
      </ul>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs text-zinc-500">
        <p className="font-medium text-zinc-300">Kullanım</p>
        <code className="mt-2 block break-all text-zinc-400">
          {`curl -H "Authorization: Bearer <API_KEY>" https://lassyy.vercel.app/api/v1/stores/<STORE_ID>/analytics`}
        </code>
      </div>
    </div>
  );
}