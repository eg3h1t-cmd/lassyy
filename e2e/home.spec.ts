import { test, expect } from "@playwright/test";

test("ana sayfa hero ve navigasyonu gösterir", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Satışınızı artıran/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ücretsiz Başla", exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Giriş Yap", exact: true }).first()).toBeVisible();
});

test("fiyatlandırma ve SSS bölümleri görünür", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Modül Fiyatları" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sıkça Sorulan Sorular" })).toBeVisible();
});