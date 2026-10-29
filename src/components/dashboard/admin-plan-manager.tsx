"use client";

import { useState } from "react";
import { setStorePlanAction, type AdminStoreRow } from "@/server/admin-plans";

const planLabels: Record<string, string> = {
  starter: "Başlangıç",
  growth: "Pro / Premium",
  enterprise: "Kurumsal",
};

export function AdminPlanManager({ stores }: { stores: AdminStoreRow[] }) {
  const [rows, setRows] = useState(stores);
  const [message, setMessage] = useState<string | null>(null);

  async function update(id: string, planId: string) {
    const result = await setStorePlanAction({
      storeId: id,
      planId: planId as "starter" | "growth" | "enterprise",
      status: "active",
    });
    if (result.ok) {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, plan_id: planId, status: "active" } : r)));
      setMessage("Plan güncellendi.");
    } else {
      setMessage(result.error);
    }
  }

  return (
    <div className="space-y-4">
      {message && <p className="text-sm text-zinc-400">{message}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="py-2">Mağaza</th>
              <th className="py-2">Sahip</th>
              <th className="py-2">Plan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {rows.map((store) => (
              <tr key={store.id}>
                <td className="py-3">
                  <p className="text-zinc-200">{store.name}</p>
                  <p className="text-xs text-zinc-500">{store.slug}</p>
                </td>
                <td className="py-3 text-zinc-400">{store.owner_email}</td>
                <td className="py-3">
                  <select
                    value={store.plan_id}
                    onChange={(e) => update(store.id, e.target.value)}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-sm text-white outline-none focus:border-indigo-400/50"
                  >
                    {Object.entries(planLabels).map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-zinc-500">
                  Mağaza bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}