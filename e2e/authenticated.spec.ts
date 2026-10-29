import { test, expect } from "@playwright/test";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

test.describe("authenticated dashboard", () => {
  test.skip(!email || !password, "Set E2E_EMAIL and E2E_PASSWORD to run authenticated tests.");

  test("signs in and reaches dashboard", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(email as string);
    await page.getByLabel("Password").fill(password as string);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });
});
