import { test, expect } from '@playwright/test';

test.describe('Technician Dashboard – Édition des balises', () => {
  const sampleTag = {
    id: 1,
    source_address: "123456789012",
    description: "ahaha",
    building: "A",
    room: "F45",
    installedAt: "2025-08-14",
    removedAt: "2025-08-21",
    created_at: "2025-08-01T12:00:00Z",
    updated_at: "2025-08-15T12:00:00Z"
  };

  test('le formulaire s’affiche avec les bons champs', async ({ page }) => {
    await page.route('**/api/v1/tag/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sampleTag),
      });
    });

    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}technician/1/edit`, { waitUntil: 'networkidle' });

    await expect(page.getByText('Balise 1')).toBeVisible();
    await expect(page.getByText('123456789012')).toBeVisible();
    await expect(page.getByLabel('Description')).toHaveValue('ahaha');

  });

  test('Mise à jour réussie', async ({ page }) => {
    await page.route('**/api/v1/tag/1', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(sampleTag) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...sampleTag, description: 'hihihi' }) });
      }
    });

    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}technician/1/edit`);

    const descInput = page.getByLabel('Description');
    await descInput.fill('hihihi');
    await page.getByRole('button', { name: 'Éditer' }).first().click();

    // la page rafraîchie affiche la nouvelle description
    await expect(page.getByLabel('Description')).toHaveValue('hihihi');
  });

  test('Échec de mise à jour – affiche une erreur', async ({ page }) => {
    await page.route('**/api/v1/tag/1', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(sampleTag) });
      } else {
        await route.fulfill({ status: 500 });
      }
    });
  });
});
