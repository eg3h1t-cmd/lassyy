export const instant = false;
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { listMyStores } from "@/server/stores";
import { CountdownCreateForm } from "@/components/dashboard/countdown-create-form";
import { StoreCountdownList } from "@/components/dashboard/store-countdown-list";

export default async function CountdownPage() {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Countdown campaigns</h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Supabase is not configured.</p>
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
      <h1 className="text-2xl font-semibold">Countdown campaigns</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Time-bound campaigns with trusted server end dates.
      </p>
      <nav className="mt-4 flex gap-4 text-sm">
        <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Overview</Link>
        <Link href="/dashboard/countdown" className="font-medium text-zinc-900 dark:text-zinc-100">Countdown</Link>
      </nav>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Create campaign</h2>
        <CountdownCreateForm stores={stores} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Existing campaigns</h2>
        {stores.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">Create a store first.</p>
        ) : (
          <div className="mt-4 space-y-6">
            {stores.map((store) => (
              <StoreCountdownList key={store.id} store={store} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

