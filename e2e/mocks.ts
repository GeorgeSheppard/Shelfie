import type { Page, Route } from "@playwright/test";

// A valid 1x1 transparent PNG, used both as a fake upload and as a fake
// stored bookcase photo returned by the mocked image endpoints.
export const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
);

interface MockResponse {
  status: number;
  body?: unknown;
}

/**
 * Mock a JSON endpoint. Pass multiple responses to return them in order on
 * successive calls (the last one repeats for any further calls) — useful for
 * simulating a refetch picking up a changed state (e.g. after unsubscribing).
 */
export function mockJson(page: Page, urlPattern: string | RegExp, responses: MockResponse[]) {
  let call = 0;
  return page.route(urlPattern, async (route: Route) => {
    const response = responses[Math.min(call, responses.length - 1)];
    call++;
    await route.fulfill({
      status: response.status,
      contentType: "application/json",
      body: response.body !== undefined ? JSON.stringify(response.body) : "",
    });
  });
}

/** Mock a bookcase photo endpoint (plain <img src>, not JSON) with a tiny real image. */
export function mockImage(page: Page, urlPattern: string | RegExp) {
  return page.route(urlPattern, async (route: Route) => {
    await route.fulfill({ status: 200, contentType: "image/png", body: TINY_PNG });
  });
}

export function fakeImageFile(name = "bookcase.png") {
  return { name, mimeType: "image/png", buffer: TINY_PNG };
}
