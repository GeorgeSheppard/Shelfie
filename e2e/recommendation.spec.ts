import { test, expect } from "@playwright/test";
import { mockJson } from "./mocks";

const REQUEST_ID = "req-1";
const REC_ID = "rec-1";

const baseRecommendation = {
  requestId: REQUEST_ID,
  hasEmail: false,
  isRecurringMonthly: false,
};

const book = {
  name: "The Midnight Library",
  author: "Matt Haig",
  description: "A novel about infinite possibilities.",
  reason: "You enjoy speculative fiction.",
  amazonLink: "https://amazon.com/midnight-library",
};

test.describe("Recommendations page", () => {
  test("shows the email capture form while processing for a new user without an email", async ({
    page,
  }) => {
    await mockJson(page, `**/api/recommendations/${REC_ID}`, [
      { status: 200, body: { ...baseRecommendation, recommendations: null } },
    ]);

    await page.goto(`/recommendations/${REC_ID}?new=true`);

    await expect(page.getByText(/Thanks for using Shelfie/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test("shows the wait message for a new user who already has an email on file", async ({
    page,
  }) => {
    await mockJson(page, `**/api/recommendations/${REC_ID}`, [
      { status: 200, body: { ...baseRecommendation, hasEmail: true, recommendations: null } },
    ]);

    await page.goto(`/recommendations/${REC_ID}?new=true`);

    await expect(page.getByText(/Feel free to close this page/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).not.toBeVisible();
  });

  test("submitting the email form re-fetches and reflects the saved email", async ({ page }) => {
    // State-driven rather than call-count-driven: React StrictMode double-invokes effects in
    // dev, so the GET can legitimately fire more than once before the form is even submitted.
    let hasEmail = false;
    await page.route(`**/api/recommendations/${REC_ID}`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ...baseRecommendation, hasEmail, recommendations: null }),
      })
    );
    await page.route("**/api/recommendations/add-email", (route) => {
      hasEmail = true;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto(`/recommendations/${REC_ID}?new=true`);
    await page.getByLabel(/email/i).fill("reader@example.com");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText(/Feel free to close this page/i)).toBeVisible();
  });

  test("shows recommendations plus the frequency form when information is missing", async ({
    page,
  }) => {
    await mockJson(page, `**/api/recommendations/${REC_ID}`, [
      { status: 200, body: { ...baseRecommendation, recommendations: [book] } },
    ]);

    await page.goto(`/recommendations/${REC_ID}`);

    await expect(page.getByText("The Midnight Library")).toBeVisible();
    await expect(page.getByText(/every month/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Unsubscribe" })
    ).not.toBeVisible();
  });

  test("only asks about monthly emails (not the email itself) once one is already on file", async ({
    page,
  }) => {
    // A user who gave an email for an earlier recommendation but never opted into monthly
    // emails should just be asked about the recurring toggle here, not for their email again.
    await mockJson(page, `**/api/recommendations/${REC_ID}`, [
      {
        status: 200,
        body: { ...baseRecommendation, hasEmail: true, recommendations: [book] },
      },
    ]);

    await page.goto(`/recommendations/${REC_ID}`);

    await expect(page.getByText(/every month/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).not.toBeVisible();
  });

  test("hides the frequency form and shows unsubscribe once fully subscribed", async ({
    page,
  }) => {
    await mockJson(page, `**/api/recommendations/${REC_ID}`, [
      {
        status: 200,
        body: {
          ...baseRecommendation,
          hasEmail: true,
          isRecurringMonthly: true,
          recommendations: [book],
        },
      },
    ]);

    await page.goto(`/recommendations/${REC_ID}`);

    await expect(page.getByText("The Midnight Library")).toBeVisible();
    await expect(page.getByText(/every month/i)).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Unsubscribe" })).toBeVisible();
  });

  test("shows a fallback when there are no recommendations", async ({ page }) => {
    await mockJson(page, `**/api/recommendations/${REC_ID}`, [
      { status: 200, body: { ...baseRecommendation, recommendations: [] } },
    ]);

    await page.goto(`/recommendations/${REC_ID}`);

    await expect(page.getByText(/no recommendations, want to try again/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Home" })).toBeVisible();
  });

  test("shows an error state when the recommendation can't be found", async ({ page }) => {
    await mockJson(page, `**/api/recommendations/${REC_ID}`, [
      { status: 404, body: { error: "Recommendation not found", success: false } },
    ]);

    await page.goto(`/recommendations/${REC_ID}`);

    // React Query retries a failed query a few times by default before settling into the
    // error state, so this takes noticeably longer than a normal assertion.
    await expect(page.getByRole("button", { name: "Home" })).toBeVisible({ timeout: 15_000 });
  });

  test("links to the profile page", async ({ page }) => {
    await mockJson(page, `**/api/recommendations/${REC_ID}`, [
      { status: 200, body: { ...baseRecommendation, recommendations: [book] } },
    ]);
    await mockJson(page, `**/api/profile/${REQUEST_ID}`, [
      { status: 200, body: { images: [], customPreferences: null, success: true } },
    ]);

    await page.goto(`/recommendations/${REC_ID}`);
    await page
      .getByRole("button", { name: "Manage your profile" })
      .click();

    await expect(page).toHaveURL(`/profile/${REQUEST_ID}`);
  });

  test("unsubscribing shows a confirmation step then updates the page", async ({ page }) => {
    await mockJson(page, `**/api/recommendations/${REC_ID}`, [
      {
        status: 200,
        body: {
          ...baseRecommendation,
          hasEmail: true,
          isRecurringMonthly: true,
          recommendations: [book],
        },
      },
    ]);
    await mockJson(page, "**/api/recommendations/delete-email", [{ status: 200, body: {} }]);

    await page.goto(`/recommendations/${REC_ID}`);
    await page.getByRole("button", { name: "Unsubscribe" }).click();

    await expect(page.getByText(/are you sure you want to unsubscribe/i)).toBeVisible();

    await page.getByRole("button", { name: "Confirm unsubscribe" }).click();

    await expect(
      page.getByText(/you've been unsubscribed and won't receive any more emails/i)
    ).toBeVisible();
  });

  test("cancelling the unsubscribe confirmation returns to the link", async ({ page }) => {
    await mockJson(page, `**/api/recommendations/${REC_ID}`, [
      {
        status: 200,
        body: {
          ...baseRecommendation,
          hasEmail: true,
          isRecurringMonthly: true,
          recommendations: [book],
        },
      },
    ]);

    await page.goto(`/recommendations/${REC_ID}`);
    await page.getByRole("button", { name: "Unsubscribe" }).click();
    await page.getByRole("button", { name: "Cancel unsubscribe" }).click();

    await expect(page.getByRole("button", { name: "Unsubscribe" })).toBeVisible();
  });
});
