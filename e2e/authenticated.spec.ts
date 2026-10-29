import { test, expect } from "@playwright/test";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

test.describe("kimlik doğrulamalı panel", () => {
  test.skip(!email || !password, "Kimlik doğrulamalı testler için E2E_EMAIL ve E2E_PASSWORD ayarlayın.");

  test("giriş yapar ve panele ulaşır", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("E-posta").fill(email as string);
    await page.getByLabel("Şifre").fill(password as string);
    await page.getByRole("button", { name: "Giriş Yap" }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Genel Bakış" })).toBeVisible();
  });
});