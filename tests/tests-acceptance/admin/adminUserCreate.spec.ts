import { test, expect } from "@playwright/test";

test.describe("Création d'un utilisateur", () => {
  test('le formulaire de création s’affiche avec les bons champs', async ({ page }) => {
    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}admin/create`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: 'Ajoutez une personne' })).toBeVisible();

    await expect(page.getByLabel('Prénom')).toBeVisible();
    await expect(page.getByLabel('Nom').first()).toBeVisible();
    await expect(page.getByLabel('Rôle')).toBeVisible();
    await expect(page.getByLabel("Numéro de téléphone")).toBeVisible();
    await expect(page.getByLabel("Adresse mail")).toBeVisible();
    await expect(page.getByRole('button', { name: 'Créer' })).toBeVisible();
  });

  test('création réussie', async ({ page }) => {
    await page.route('**/api/v1/users', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1
    }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}admin/create`);

    await page.getByLabel('Prénom').fill('Bémol');
    await page.getByLabel('Nom').first().fill('Cat');

    await page.getByLabel('Rôle').click();
    await page.getByRole('option', { name: 'Admin' }).click();

    await page.getByLabel('Numéro de téléphone').fill('0678566767');
    await page.getByLabel('Adresse mail').fill('bemol.cat@gmail.com');

    await Promise.all([
  
      page.getByRole('button', { name: 'Créer' }).click()
    ]);
  });

});
