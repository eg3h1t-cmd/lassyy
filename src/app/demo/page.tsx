export const instant = false;
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { listMyStores } from "@/server/stores";
import { StoreDemoSection } from "@/components/demo/store-demo-section";

export default async function DemoPage() {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Demo Vitrin</h1>
        <p className="mt-4 text-sm text-zinc-400">Supabase yapılandırılmamış.</p>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const stores = await listMyStores();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-white">Demo Vitrin</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Yapılandırdığınız modülleri önizleyin. Sonuçlar sunucu tarafında belirlenir.
      </p>

      <div className="mt-8 space-y-10">
        {stores.length === 0 && (
          <p className="text-sm text-zinc-400">Önce bir mağaza oluşturun.</p>
        )}
        {stores.map((store) => (
          <StoreDemoSection key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}

