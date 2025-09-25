import { test, expect } from "@playwright/test";

test.describe("Dashboard – Liste des balises", () => {
  test.beforeEach(async ({ page }) => {
    // 🔐 Simulation du localStorage avec un utilisateur connecté (technicien)
    await page.addInitScript(() => {
      localStorage.setItem("token", "bearer-fake-123");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 42,
          firstname: "Technicien",
          lastname: "Testeur",
          email: "tech@test.fr",
          role: "technician",
        })
      );
    });

    // 🔐 Mock /auth/me
    await page.route("**/api/v1/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 42,
          email: "tech@test.fr",
          role: "technician",
        }),
      });
    });
  });

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

    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}tag/1/edit`);

    await expect(page.getByText("123456789012")).toBeVisible();
    await expect(page.getByText("987654321098")).toBeVisible();
  });
});
