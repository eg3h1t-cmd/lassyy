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
      if (result.ok) setMessage(result.message);
      else setMessage(result.error);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Redemption failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">Redeem coupon</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        {message && <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Redeeming..." : "Redeem"}
        </button>
      </form>
    </div>
  );
}