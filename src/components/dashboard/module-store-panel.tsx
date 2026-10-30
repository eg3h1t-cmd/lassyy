"use client";

import { useState } from "react";
import Link from "next/link";
import { requestModulePurchaseAction, type StoreModuleRow } from "@/server/module-store";
import { moduleLabels } from "@/lib/module-labels";

const accents: Record<string, string> = {
  sans_carki: "from-rose-400 to-orange-400",
  wp_sepet_hatirlatma: "from-emerald-400 to-teal-400",
  wp_kampanya_toplu: "from-amber-400 to-yellow-400",
  wp_kargo_takip: "from-sky-400 to-cyan-400",
  akilli_sepet_onerisi: "from-lime-400 to-emerald-400",
  akilli_beden: "from-violet-400 to-fuchsia-400",
  cikis_niyetli_popup: "from-fuchsia-400 to-pink-400",
  analitik: "from-indigo-400 to-violet-400",
  geri_sayim_kampanyalari: "from-orange-400 to-amber-400",
  urun_onerileri: "from-cyan-400 to-sky-400",
};

const icons: Record<string, string> = {
  sans_carki: "🎡",
  wp_sepet_hatirlatma: "🛒",
  wp_kampanya_toplu: "📣",
  wp_kargo_takip: "📦",
  akilli_sepet_onerisi: "🧺",
  akilli_beden: "📐",
  cikis_niyetli_popup: "🚪",
  analitik: "📊",
  geri_sayim_kampanyalari: "⏳",
  urun_onerileri: "✨",
};

type TenantModule = { module_id: string; status: string; purchased_at: string | null };

export function ModuleStorePanel({
  storeId,
  storeSlug,
  modules,
  tenantModules,
}: {
  storeId: string;
  storeSlug: string;
  modules: StoreModuleRow[];
  tenantModules: TenantModule[];
}) {
  const [owned, setOwned] = useState<TenantModule[]>(tenantModules);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  function statusFor(moduleId: string) {
    return owned.find((m) => m.module_id === moduleId)?.status ?? "none";
  }

  async function buy(moduleSlug: string) {
    setMessage(null);
    setLoadingSlug(moduleSlug);
    const result = await requestModulePurchaseAction({ storeId, moduleSlug });
    if (result.ok) {
      setOwned((prev) => {
        const moduleRow = modules.find((m) => m.slug === moduleSlug);
        if (!moduleRow) return prev;
        const next = prev.filter((m) => m.module_id !== moduleRow.id);
        return [...next, { module_id: moduleRow.id, status: result.status, purchased_at: null }];
      });
      setMessage(
        result.status === "active"
          ? "Bu modül zaten aktif."
          : "Satın alma talebi oluşturuldu. Ödeme onayından sonra modül aktifleşir.",
      );
    } else {
      setMessage(result.error);
    }
    setLoadingSlug(null);
  }

  return (
    <div className="space-y-5">
      {message && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-700">
          {message}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const status = statusFor(module.id);
          const accent = accents[module.slug] ?? "from-indigo-400 to-violet-400";
          return (
            <div
              key={module.id}
              className="surface surface-hover group relative overflow-hidden rounded-2xl p-5"
            >
              <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accent}`} />
              <div className="flex items-start justify-between gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {icons[module.slug] ?? "✨"}
                </span>
                {status === "active" ? (
                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-400/20">
                    Aktif
                  </span>
                ) : status === "pending" ? (
                  <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 ring-1 ring-amber-400/20">
                    Ödeme bekliyor
                  </span>
                ) : (
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600 ring-1 ring-white/10">
                    Satın alınmadı
                  </span>
                )}
              </div>

              <h3 className="mt-3 font-semibold text-zinc-900">{module.name}</h3>
              <p className="mt-1 min-h-10 text-xs leading-relaxed text-zinc-600">{module.description}</p>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xl font-semibold text-zinc-900">{module.price.toLocaleString("tr-TR")} TL</p>
                  <p className="text-[10px] text-zinc-500">tek seferlik ödeme</p>
                </div>
                {status === "active" ? (
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700">
                      Aktif
                    </span>
                    {moduleLabels[module.slug]?.route && (
                      <Link
                        href={`/dashboard/${storeSlug}/modules/${moduleLabels[module.slug].route}`}
                        className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:border-indigo-400/40 hover:bg-zinc-100"
                      >
                        Yapılandır
                      </Link>
                    )}
                  </div>
                ) : status === "pending" ? (
                  <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                    Onay bekliyor
                  </span>
                ) : (
                  <button
                    onClick={() => buy(module.slug)}
                    disabled={loadingSlug === module.slug}
                    className={`accent-gradient glow-button rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50`}
                  >
                    {loadingSlug === module.slug ? "..." : "Satın Al"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-zinc-500">
        Satın alma talebi oluşturulur; modül, ödeme sağlayıcısından doğrulanan ödeme sonrası aktifleşir.
      </p>
    </div>
  );
}