import Link from "next/link";
import type { WhatsAppModule } from "@/server/whatsapp/dashboard";

type Purchase = { module_id: string; status: string; purchased_at: string | null };
type Connection = {
  provider: string;
  phone_number: string | null;
  business_account_id: string | null;
  status: string;
  connected_at: string | null;
} | null;

const accents: Record<string, string> = {
  wp_sepet_hatirlatma: "from-emerald-400 to-teal-400",
  wp_kampanya_toplu: "from-amber-400 to-yellow-400",
  wp_kargo_takip: "from-sky-400 to-cyan-400",
};

const icons: Record<string, string> = {
  wp_sepet_hatirlatma: "🛒",
  wp_kampanya_toplu: "📣",
  wp_kargo_takip: "📦",
};

export function WhatsAppDashboardPanel({
  storeSlug,
  modules,
  purchases,
  connection,
  apiConfigured,
  counts,
  recent,
}: {
  storeSlug: string;
  modules: WhatsAppModule[];
  purchases: Purchase[];
  connection: Connection;
  apiConfigured: boolean;
  counts: Record<string, number>;
  recent: Array<{
    id: string;
    recipient_phone: string;
    template_key: string;
    status: string;
    created_at: string;
    error: string | null;
  }>;
}) {
  const purchaseMap = new Map(purchases.map((p) => [p.module_id, p.status]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">WhatsApp modülleri</h2>
          <p className="text-sm text-zinc-600">Tekil satın alma, abonelik yok.</p>
        </div>
        <Link
          href={`/dashboard/${storeSlug}/store`}
          className="accent-gradient glow-button inline-flex h-9 items-center justify-center rounded-lg px-4 text-xs font-semibold text-white"
        >
          Modül mağazası
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {modules.map((module) => {
          const status = purchaseMap.get(module.id) ?? "none";
          const accent = accents[module.slug] ?? "from-indigo-400 to-violet-400";
          return (
            <div key={module.id} className="surface relative overflow-hidden rounded-2xl p-5">
              <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accent}`} />
              <div className="flex items-start justify-between">
                <span className="text-2xl" aria-hidden="true">{icons[module.slug] ?? "💬"}</span>
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
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">{module.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-lg font-semibold text-zinc-900">{module.price.toLocaleString("tr-TR")} TL</p>
                {status !== "active" && (
                  <Link
                    href={`/dashboard/${storeSlug}/store`}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-indigo-400/40"
                  >
                    {status === "pending" ? "Onay bekliyor" : "Satın Al"}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface rounded-2xl p-5">
          <h3 className="font-semibold text-zinc-900">Bağlantı durumu</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">API yapılandırması</dt>
              <dd className={apiConfigured ? "text-emerald-700" : "text-amber-700"}>
                {apiConfigured ? "Hazır" : "Env değişkenleri eksik"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Sağlayıcı</dt>
              <dd className="text-zinc-200">{connection?.provider ?? "Bağlı değil"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Numara</dt>
              <dd className="text-zinc-200">{connection?.phone_number ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Durum</dt>
              <dd className="text-zinc-200">{connection?.status ?? "disconnected"}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-zinc-500">
            Meta Cloud API anahtarları server tarafında `WHATSAPP_ACCESS_TOKEN`,
            `WHATSAPP_PHONE_NUMBER_ID` ve `WHATSAPP_VERIFY_TOKEN` ile yapılandırılır.
          </p>
        </div>

        <div className="surface rounded-2xl p-5">
          <h3 className="font-semibold text-zinc-900">Son 30 gün mesajları</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["Kuyrukta", counts.queued ?? 0],
              ["Gönderildi", counts.sent ?? 0],
              ["Teslim", counts.delivered ?? 0],
              ["Okundu", counts.read ?? 0],
              ["Hata", counts.failed ?? 0],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
                <p className="mt-1 text-xl font-semibold text-zinc-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="surface rounded-2xl p-5">
        <h3 className="font-semibold text-zinc-900">Son mesajlar</h3>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">Henüz mesaj kaydı yok.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="py-2">Alıcı</th>
                  <th className="py-2">Şablon</th>
                  <th className="py-2">Durum</th>
                  <th className="py-2">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {recent.map((message) => (
                  <tr key={message.id}>
                    <td className="py-2 text-zinc-700">{message.recipient_phone}</td>
                    <td className="py-2 text-zinc-600">{message.template_key}</td>
                    <td className="py-2 text-zinc-700">{message.status}</td>
                    <td className="py-2 text-zinc-500">
                      {new Date(message.created_at).toLocaleString("tr-TR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}