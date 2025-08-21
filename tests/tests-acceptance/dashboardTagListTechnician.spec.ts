import { test, expect } from "@playwright/test";

test.describe("Dashboard – Liste des balises", () => {
  test("Affiche les balises disponibles", async ({ page }) => {
    await page.route("**/api/v1/tag", async route => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [
            { id: 1, source_address: "123456789012" },
            { id: 2, source_address: "987654321098" },
          ],
          metadata: {},
        }),
      });
    });

    await page.goto("http://localhost:5173/release/technician/1/edit");

    await expect(page.getByText('123456789012').first()).toBeVisible();
    await expect(page.getByText("987654321098").first()).toBeVisible();
  });
});
