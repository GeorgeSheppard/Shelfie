import { test, expect } from "@playwright/test";
import { mockJson } from "./mocks";

test.describe("Unsubscribe page", () => {
  test("shows success once the email is removed", async ({ page }) => {
    await mockJson(page, "**/api/recommendations/delete-email", [{ status: 200, body: {} }]);

    await page.goto("/unsubscribe/req-1");

    await expect(page.getByText("You are now unsubscribed")).toBeVisible();
  });

  test("shows a support link when unsubscribing fails", async ({ page }) => {
    await mockJson(page, "**/api/recommendations/delete-email", [
      { status: 400, body: { error: "Invalid request", success: false } },
    ]);

    await page.goto("/unsubscribe/req-1");

    await expect(
      page.getByText(/something went wrong, please try again or contact support/i)
    ).toBeVisible();

    await page.getByRole("button", { name: "Support" }).click();
    await expect(page).toHaveURL("/support");
  });
});
