// Subscription readiness: plan definitions and server-side entitlement checks.
// No payment provider is integrated. Development-only status is supported.

export type PlanId = "starter" | "growth" | "enterprise";

export interface Plan {
  id: PlanId;
  name: string;
  limits: {
    stores: number;
    campaignsPerStore: number;
    monthlyWidgetEvents: number;
  };
  features: string[];
}

export const PLAN_LABELS: Record<PlanId, string> = {
  starter: "Başlangıç",
  growth: "Pro / Premium",
  enterprise: "Kurumsal",
};

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: "starter",
    name: "Starter",
    limits: { stores: 1, campaignsPerStore: 3, monthlyWidgetEvents: 1000 },
    features: ["basic-widgets"],
  },
  growth: {
    id: "growth",
    name: "Growth",
    limits: { stores: 5, campaignsPerStore: 1_000_000, monthlyWidgetEvents: 250000 },
    features: ["basic-widgets", "all-modules", "priority-support"],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    limits: { stores: 100, campaignsPerStore: 1_000_000, monthlyWidgetEvents: 10_000_000 },
    features: ["basic-widgets", "all-modules", "priority-support", "custom-integrations"],
  },
};

// Development-only: resolve plan from env or default to starter.
// In production this must come from a verified subscription record, never the browser.
export function resolveDevPlan(): PlanId {
  const envPlan = process.env.DEV_SUBSCRIPTION_PLAN as PlanId | undefined;
  if (envPlan && envPlan in PLANS) return envPlan;
  return "starter";
}

export function hasFeature(plan: PlanId, feature: string): boolean {
  return PLANS[plan].features.includes(feature);
}