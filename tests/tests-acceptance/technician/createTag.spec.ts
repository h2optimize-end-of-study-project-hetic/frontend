import { test, expect } from "@playwright/test";

test.describe("Dashboard – Création de balise", () => {
  test('le formulaire de création s’affiche avec les bons champs', async ({ page }) => {
    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}technician/create`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: 'Créer une nouvelle balise' })).toBeVisible();
    await expect(page.getByLabel('Identifiant unique')).toBeVisible();
    await expect(page.getByLabel('Description')).toBeVisible();
    await expect(page.getByLabel('Bâtiment')).toBeVisible();
    await expect(page.getByLabel('Pièce').first()).toBeVisible();
    await expect(page.getByLabel("Date installation dans la pièce")).toBeVisible();
    await expect(page.getByLabel("Date de fin")).toBeVisible();
    await expect(page.getByRole('button', { name: 'Créer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Annuler' })).toBeVisible();
  });

  test('création réussie redirige vers la vue tableau', async ({ page }) => {
    await page.route('**/api/v1/tag', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1 }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}technician/create`);

    await page.getByLabel('Identifiant unique').fill('123456789012');
    await page.getByLabel('Description').fill('Nouvelle balise');

    await page.getByLabel('Bâtiment').click();
    await page.getByRole('option', { name: 'Bâtiment A' }).click();

    await page.getByLabel('Pièce').first().click();
    await page.getByRole('option', { name: 'F45' }).click();

    await page.getByLabel("Date installation dans la pièce").fill('2025-08-14');
    await page.getByLabel("Date de fin").fill('2025-08-21');

    await Promise.all([
      page.waitForURL(/.*\/technician\/dashboard/),
      page.getByRole('button', { name: 'Créer' }).click()
    ]);
  });

  test("annulation de la création ne modifie pas le backend", async ({ page }) => {
    const postCalled = { value: false };

    await page.route('**/api/v1/tag', async route => {
      if (route.request().method() === 'POST') {
        postCalled.value = true;
      }
      await route.continue();
    });

    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}technician/create`);

    await page.getByRole('button', { name: 'Annuler' }).click();
    expect(postCalled.value).toBe(false);
  });
});
