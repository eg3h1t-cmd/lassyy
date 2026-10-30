"use client";

import { useState } from "react";
import { redeemCouponAction } from "@/server/wheel";

export default function RedeemPage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const result = await redeemCouponAction({ code, customerEmail: email || undefined });
      if (result.ok) setMessage("Kupon başarıyla kullanıldı.");
      else setMessage(result.error);
    } catch {
      setMessage("Kupon kullanılamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold text-zinc-900">Kupon Kullan</h1>
      <p className="mt-2 text-sm text-zinc-600">Kupon kodunuzu girerek indiriminizi kullanın.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input
          placeholder="Kupon kodu"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-indigo-400/50"
        />
        <input
          type="email"
          placeholder="E-posta (isteğe bağlı)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-indigo-400/50"
        />
        {message && <p className="text-sm text-zinc-700">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="accent-gradient glow-button w-full rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Kullanılıyor..." : "Kullan"}
        </button>
      </form>
    </div>
  );
}