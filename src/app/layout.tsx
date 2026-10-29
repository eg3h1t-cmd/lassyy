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
  title: "lassyy — E-commerce growth and promotion platform",
  description:
    "Centralize customer engagement, promotional campaigns, marketing widgets, and analytics for e-commerce stores.",
  applicationName: "lassyy",
  openGraph: {
    title: "lassyy — E-commerce growth and promotion platform",
    description:
      "Promotional campaigns, marketing widgets, and analytics for e-commerce stores.",
    siteName: "lassyy",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <Suspense fallback={<div className="p-8 text-sm text-zinc-500">Loading…</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}