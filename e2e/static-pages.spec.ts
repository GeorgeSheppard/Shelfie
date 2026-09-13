import { test, expect } from "@playwright/test";

test.describe("Static pages", () => {
  test("home page renders the upload prompt", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(/upload pictures of your bookshelf or bookcase/i)
    ).toBeVisible();
  });

  test("support page shows contact details", async ({ page }) => {
    await page.goto("/support");
    await expect(page.getByText("support@shelfie.com")).toBeVisible();
  });

  test("privacy policy page renders", async ({ page }) => {
    await page.goto("/privacy");
    await expect(
      page.getByRole("heading", { name: "Privacy Policy", exact: true })
    ).toBeVisible();
  });
});
