import { test, expect } from "@playwright/test";

test("home page renders hero and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Grow store revenue/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Get started/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Sign in/i })).toBeVisible();
});

test("pricing and faq sections visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Pricing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Frequently asked questions" })).toBeVisible();
});