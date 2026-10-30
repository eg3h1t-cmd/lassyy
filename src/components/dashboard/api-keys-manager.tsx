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
          className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-indigo-400/50"
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
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs text-emerald-700">Yeni API anahtarı (yalnızca bir kez gösterilir)</p>
          <code className="mt-2 block break-all font-mono text-sm text-zinc-900">{newKey}</code>
        </div>
      )}
      {message && <p className="text-sm text-zinc-600">{message}</p>}

      <ul className="divide-y divide-zinc-200">
        {keys.map((key) => (
          <li key={key.id} className="flex items-center justify-between py-3 text-sm">
            <div>
              <p className="text-zinc-200">{key.name}</p>
              <p className="text-xs text-zinc-500">
                {key.key_prefix}… — {key.revoked_at ? "iptal edildi" : "aktif"}
              </p>
            </div>
            {!key.revoked_at && (
              <button onClick={() => revoke(key.id)} className="text-xs text-red-400 hover:text-red-600">
                İptal et
              </button>
            )}
          </li>
        ))}
        {keys.length === 0 && <li className="py-3 text-sm text-zinc-500">Henüz API anahtarı yok.</li>}
      </ul>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-500">
        <p className="font-medium text-zinc-700">Kullanım</p>
        <code className="mt-2 block break-all text-zinc-600">
          {`curl -H "Authorization: Bearer <API_KEY>" https://lassyy.vercel.app/api/v1/stores/<STORE_ID>/analytics`}
        </code>
      </div>
    </div>
  );
}