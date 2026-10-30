import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "lassyy — E-ticaret büyüme ve promosyon platformu",
  description:
    "E-ticaret mağazaları için müşteri etkileşimi, promosyon kampanyaları, pazarlama widget'ları ve analitiği tek panelde yönetin.",
  applicationName: "lassyy",
  openGraph: {
    title: "lassyy — E-ticaret büyüme ve promosyon platformu",
    description:
      "E-ticaret mağazaları için promosyon kampanyaları, pazarlama widget'ları ve analitik.",
    siteName: "lassyy",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <Suspense fallback={<div className="p-8 text-sm text-zinc-500">Yükleniyor…</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}