import { test, expect } from "@playwright/test";
import { mockJson, fakeImageFile } from "./mocks";

test.describe("Home — uploading a bookcase photo", () => {
  test("navigates to the recommendations page on a successful upload", async ({ page }) => {
    await mockJson(page, "**/api/recommendations/from-bookcase", [
      { status: 200, body: { id: "rec-1", success: true } },
    ]);
    await mockJson(page, "**/api/recommendations/rec-1", [
      {
        status: 200,
        body: {
          recommendations: null,
          hasEmail: false,
          isRecurringMonthly: false,
          requestId: "req-1",
          success: true,
        },
      },
    ]);

    await page.goto("/");
    await page.locator('input[type="file"]').setInputFiles(fakeImageFile());

    await expect(page).toHaveURL(/\/recommendations\/rec-1\?new=true/);
    await expect(
      page.getByText(/Thanks for using Shelfie/i)
    ).toBeVisible();
  });

  test("shows an error and stays on the page when the upload fails", async ({ page }) => {
    await mockJson(page, "**/api/recommendations/from-bookcase", [
      {
        status: 500,
        body: { error: "Failed to queue recommendation processing", success: false },
      },
    ]);

    await page.goto("/");
    await page.locator('input[type="file"]').setInputFiles(fakeImageFile());

    await expect(page.getByText("Failed to queue recommendation processing")).toBeVisible();
    await expect(page).toHaveURL("/");
  });

  test("shows a friendly message for an unsupported file type", async ({ page }) => {
    await page.goto("/");
    await page.locator('input[type="file"]').setInputFiles({
      name: "notes.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("not an image"),
    });

    await expect(page.getByText(/format is not supported/i)).toBeVisible();
    await expect(page).toHaveURL("/");
  });
});
