import { test, expect } from "@playwright/test";

test("giriş sayfası formu gösterir", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByRole("heading", { name: "Giriş Yap" })).toBeVisible();
  await expect(page.getByLabel("E-posta")).toBeVisible();
  await expect(page.getByLabel("Şifre")).toBeVisible();
});

test("kayıt sayfası formu gösterir", async ({ page }) => {
  await page.goto("/sign-up");
  await expect(page.getByRole("heading", { name: "Hesap Oluştur" })).toBeVisible();
});