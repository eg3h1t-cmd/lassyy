"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasSupabasePublicConfig as hasSupabaseConfig } from "@/lib/supabase/public-config";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!hasSupabaseConfig()) {
      setMessage("Supabase yapılandırılmamış. Gerekli ortam değişkenlerini ayarlayın.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage("Kayıt başarısız. Bilgilerinizi kontrol edip tekrar deneyin.");
      else setMessage("Hesabınızı onaylamak için e-postanızı kontrol edin, ardından giriş yapın.");
    } catch {
      setMessage("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold text-white">Hesap Oluştur</h1>
      <p className="mt-2 text-sm text-zinc-400">Mağaza promosyonlarınızı yönetmeye başlayın.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="email">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-indigo-400/50"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="password">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-indigo-400/50"
          />
        </div>
        {message && <p className="text-sm text-zinc-400">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="accent-gradient glow-button w-full rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
        </button>
      </form>
      <p className="mt-4 text-sm text-zinc-400">
        Zaten hesabınız var mı?{" "}
        <Link href="/sign-in" className="font-medium text-indigo-300 hover:text-indigo-200">
          Giriş yapın
        </Link>
      </p>
    </div>
  );
}