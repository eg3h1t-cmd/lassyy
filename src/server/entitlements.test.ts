import { describe, it, expect } from "vitest";
import { hasFeature, PLANS, resolveDevPlan } from "./entitlements";

describe("entitlements", () => {
  it("starter does not include all-modules", () => {
    expect(hasFeature("starter", "all-modules")).toBe(false);
  });

  it("growth includes all-modules", () => {
    expect(hasFeature("growth", "all-modules")).toBe(true);
  });

  it("plans have positive limits", () => {
    for (const p of Object.values(PLANS)) {
      expect(p.limits.stores).toBeGreaterThan(0);
    }
  });

  it("resolveDevPlan defaults to starter", () => {
    const prev = process.env.DEV_SUBSCRIPTION_PLAN;
    delete process.env.DEV_SUBSCRIPTION_PLAN;
    expect(resolveDevPlan()).toBe("starter");
    if (prev) process.env.DEV_SUBSCRIPTION_PLAN = prev;
  });
});