import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getPublicEnv } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const env = getPublicEnv();

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_APP_NAME} — E-commerce growth and promotion platform`,
  description:
    "Centralize customer engagement, promotional campaigns, marketing widgets, and analytics for e-commerce stores.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Suspense fallback={<div className="p-8 text-sm text-zinc-500">Loading…</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}