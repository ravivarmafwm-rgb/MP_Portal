import { expect, test, type Page } from "@playwright/test";

const apiBaseUrl = (process.env.VITE_API_URL ?? "https://mpportaldashboard.focuswebmedia.in/api").replace(/\/$/, "");

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /Sign in/i }).click();
}

test.describe("authenticated staging smoke", () => {
  test("citizen can authenticate and reach the citizen portal", async ({ page, request }) => {
    test.skip(!process.env.E2E_CITIZEN_EMAIL || !process.env.E2E_CITIZEN_PASSWORD, "Set E2E_CITIZEN_EMAIL and E2E_CITIZEN_PASSWORD to run staging smoke.");
    await signIn(page, process.env.E2E_CITIZEN_EMAIL!, process.env.E2E_CITIZEN_PASSWORD!);
    await expect(page).toHaveURL(/\/citizen$/);
    const response = await request.get(`${apiBaseUrl}/user`);
    expect(response.status()).toBe(200);
    expect((await response.json()).role_slug).toBe("citizen");
  });

  test("volunteer can authenticate and reach the volunteer portal", async ({ page, request }) => {
    test.skip(!process.env.E2E_VOLUNTEER_EMAIL || !process.env.E2E_VOLUNTEER_PASSWORD, "Set E2E_VOLUNTEER_EMAIL and E2E_VOLUNTEER_PASSWORD to run staging smoke.");
    await signIn(page, process.env.E2E_VOLUNTEER_EMAIL!, process.env.E2E_VOLUNTEER_PASSWORD!);
    await expect(page).toHaveURL(/\/volunteer$/);
    const response = await request.get(`${apiBaseUrl}/user`);
    expect(response.status()).toBe(200);
    expect((await response.json()).role_slug).toBe("volunteer");
  });

  test("official can authenticate and reach the role dashboard", async ({ page, request }) => {
    test.skip(!process.env.E2E_OFFICIAL_EMAIL || !process.env.E2E_OFFICIAL_PASSWORD, "Set E2E_OFFICIAL_EMAIL and E2E_OFFICIAL_PASSWORD to run staging smoke.");
    await signIn(page, process.env.E2E_OFFICIAL_EMAIL!, process.env.E2E_OFFICIAL_PASSWORD!);
    await expect(page).toHaveURL(/\/(dashboard|mp|mla|officer|admin|coordinator)$/);
    const response = await request.get(`${apiBaseUrl}/user`);
    expect(response.status()).toBe(200);
    expect((await response.json()).role_slug).not.toBe("citizen");
  });
});
