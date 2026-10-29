"use client";

import { useState } from "react";

const plans = [
  {
    name: "Starter",
    monthly: 0,
    description: "For development and small projects.",
    features: ["1 project", "1k interactions", "Basic analytics"],
    cta: "Start free",
    href: "/sign-up",
    accent: "from-sky-400 to-cyan-400",
  },
  {
    name: "Pro / Premium",
    monthly: 29,
    description: "For growing e-commerce teams.",
    features: ["5 projects", "Unlimited campaigns", "Advanced analytics", "Priority support"],
    cta: "Choose Pro",
    href: "/sign-up",
    highlight: true,
    accent: "from-indigo-400 to-violet-400",
  },
  {
    name: "Enterprise",
    monthly: 99,
    description: "For advanced and high-volume requirements.",
    features: ["Unlimited projects", "API access", "Multiple team members", "24/7 dedicated support"],
    cta: "Contact sales",
    href: "mailto:eg3h1t@gmail.com?subject=lassyy%20Enterprise%20plan",
    accent: "from-fuchsia-400 to-rose-400",
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="border-t border-white/[0.06] py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">Pricing</h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Simple plans that scale with your store. Payment processing is not included in this version.
            </p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 text-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                annual ? "text-zinc-400 hover:text-white" : "bg-white text-zinc-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                annual ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-white"
              }`}
            >
              Annual <span className="text-emerald-400">−20%</span>
            </button>
          </div>
        </div>

        <p className="mt-4 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1 text-xs font-medium text-emerald-300">
          Save 20% with annual billing
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => {
            const price = annual ? Math.round(p.monthly * 0.8) : p.monthly;
            return (
              <div
                key={p.name}
                className={`relative overflow-hidden rounded-2xl p-6 ${
                  p.highlight
                    ? "border border-indigo-400/30 bg-gradient-to-b from-indigo-500/[0.14] to-violet-500/[0.04] shadow-[0_0_70px_-20px_rgba(99,102,241,0.65)]"
                    : "surface surface-hover"
                }`}
              >
                <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${p.accent}`} />
                {p.highlight && (
                  <span className="absolute right-4 top-4 rounded-full bg-indigo-400/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-200 ring-1 ring-indigo-400/30">
                    Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-semibold text-white">${price}</span>
                  <span className="mb-1 text-sm text-zinc-400">/mo</span>
                </div>
                {annual && p.monthly > 0 && (
                  <p className="mt-1 text-xs text-emerald-300">
                    ${price * 12}/year — 20% off
                  </p>
                )}
                {p.monthly === 0 && <p className="mt-1 text-xs text-zinc-500">Free forever</p>}
                <p className="mt-2 text-sm text-zinc-400">{p.description}</p>
                <ul className="mt-6 space-y-2 text-sm text-zinc-300">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className={`mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r ${p.accent}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={p.href}
                  className={`mt-6 inline-flex h-10 w-full items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                    p.highlight
                      ? "accent-gradient glow-button text-white"
                      : "border border-white/10 bg-white/[0.03] text-zinc-100 hover:border-indigo-400/40 hover:bg-white/[0.06]"
                  }`}
                >
                  {p.cta}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}