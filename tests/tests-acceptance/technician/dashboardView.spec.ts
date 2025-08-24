import { test, expect } from "@playwright/test";

test.describe("Dashboard – Vue tableau du technicien", () => {
  const sampleTags = [
    {
      id: 1,
      source_address: "123456789012",
      name: "Balise 1",
      description: "Test balise",
      building: "A",
      room: "F45",
      installedAt: "2025-08-14",
      removedAt: "2025-08-21",
    },
  ];

  test.beforeEach(async ({ page }) => {
    await page.route("**/api/v1/tag", async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: sampleTags }),
      });
    });

    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}technician/dashboard`);
  });

  test("la page s’affiche avec les bons champs et boutons", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Vue Édition" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Vue tableau" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Créer une balise" })).toBeVisible();

    await expect(page.getByText("Balise 1")).toBeVisible();
    await expect(page.getByText("123456789012")).toBeVisible();
  });

  test("mise à jour réussie après édition", async ({ page }) => {
    await page.route("**/api/v1/tag/1", async route => {
      if (route.request().method() === "PATCH") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      } else {
        await route.continue();
      }
    });

    const editButton = page.getByRole("button", { name: "éditer" }).first();
    await editButton.click();
  });


});
