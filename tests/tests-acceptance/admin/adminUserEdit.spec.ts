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

  test.beforeEach(async ({ page }) => {
    // Mock localStorage
    await page.addInitScript(() => {
      localStorage.setItem("token", "bearer-fake-123");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 99,
          firstname: "Admin",
          lastname: "Test",
          email: "admin@test.fr",
          role: "admin",
        })
      );
    });

    // Mock /auth/me
    await page.route('**/api/v1/auth/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 99,
          email: "admin@test.fr",
          role: "admin",
        }),
      });
    });
  });


  test('Mise à jour réussie', async ({ page }) => {
    await page.route('**/api/v1/users/1', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(sampleUser),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ...sampleUser, firstname: 'Ratatouille' }),
        });
      }
    });

    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}user/1/edit-user`);

    const prenomInput = page.getByLabel('Prénom');
    await prenomInput.fill('Ratatouille');
    await page.getByRole('button', { name: 'Éditer' }).click();

    await expect(prenomInput).toHaveValue('Ratatouille');
  });

  test('Échec de mise à jour – affiche une erreur', async ({ page }) => {
    await page.route('**/api/v1/users/1', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(sampleUser),
        });
      } else {
        await route.fulfill({ status: 500 });
      }
    });

    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}user/1/edit-user`);

    await page.getByRole('button', { name: 'Éditer' }).click();

    await expect(page.locator('[role="alert"]')).toBeVisible();
  });
});
