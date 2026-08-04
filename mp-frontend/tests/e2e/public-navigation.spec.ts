import { expect, test } from "@playwright/test";

test.describe("public portal navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/public/statistics", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          citizens_served: 1200,
          grievances_resolved: 340,
          projects_completed: 42,
          active_volunteers: 86,
          updated_at: new Date().toISOString(),
        }),
      }),
    );
    await page.route("**/api/user", (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: '{"message":"Unauthenticated."}' }),
    );
  });

  test("landing page exposes public navigation and live-stat fallback", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/MP Connect|Constituency/i);
    await expect(page.getByRole("heading", { name: /One constituency/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Login", exact: true }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign Up", exact: true }).first()).toBeVisible();

    const liveStats = page.getByText("Live statistics are temporarily unavailable.");
    const statHeading = page.getByRole("heading", { name: /Public service in measurable action/i });
    await expect(statHeading).toBeVisible();
    await expect(liveStats.or(page.getByLabel("Loading public statistics")).or(page.getByText("Citizens served"))).toBeVisible();
  });

  test("login and registration routes are reachable from the landing page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Login", exact: true }).first().click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByLabel("Email address")).toBeVisible();

    await page.goto("/");
    await page.getByRole("link", { name: "Sign Up", exact: true }).first().click();
    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByRole("heading", { name: "Create citizen account", exact: true })).toBeVisible();
  });

  test("protected dashboard redirects an unauthenticated visitor to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });
});
