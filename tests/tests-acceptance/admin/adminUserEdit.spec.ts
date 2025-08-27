import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard – Édition des utilisateurs', () => {
  const sampleUser = {
    id: 1,
    firstname: "Bob",
    lastname: "Bobby",
    email: "bobby@gmail.com",
    phone_number: "0688787878",
    role: "Admin",
  };

  test('le formulaire s’affiche avec les bons champs', async ({ page }) => {
    await page.route('**/api/v1/users/1', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sampleUser),
      });
    });

    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}admin/1/edit-user`, { waitUntil: 'networkidle' });
    
    await page.getByRole('button', { name: 'Éditer' }).first().click();
    await expect(page.getByText('Nom').first()).toHaveValue('Bobby');
    await expect(page.getByText('Prénom').first()).toHaveValue('Bob');
    await expect(page.getByLabel('Email').first()).toHaveValue('bobby@gmail.com');
    await expect(page.getByLabel('Numéro de téléphone').first()).toHaveValue('0688787878');
    await page.getByLabel('Rôle').first().click();
    await page.getByRole('option', { name: 'Admin' }).click();

  });

  test('Mise à jour réussie', async ({ page }) => {
    await page.route('**/api/v1/users/1', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(sampleUser) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...sampleUser, firstname: 'Ratatouille' }) });
      }
    });

    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}admin/1/edit-user`);

    const descInput = page.getByLabel('Prénom');
    await descInput.fill('Ratatouille');
    await page.getByRole('button', { name: 'Éditer' }).first().click();

    await expect(page.getByLabel('Prénom')).toHaveValue('Ratatouille');
  });

  test('Échec de mise à jour – affiche une erreur', async ({ page }) => {
    await page.route('**/api/v1/users/1', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(sampleUser) });
      } else {
        await route.fulfill({ status: 500 });
      }
    });
  });
});

