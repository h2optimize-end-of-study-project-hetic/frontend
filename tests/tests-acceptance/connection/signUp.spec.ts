import { test, expect } from '@playwright/test';

test.describe('Inscription avec API mockée', () => {
  test('Inscription OK', async ({ page }) => {
    // Mock
    await page.route('**/api/sign-up', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: '123456',
          user: { id: 1,
                  email: 'john.doe@example.com',
                  role: 'admin',
                  firstName: "John",
                  lastName: "Doe"
                }
        })
      });
    });

    // Aller sur /login
    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}sign-up`, { waitUntil: 'networkidle' });

    // Attendre et remplir le champ firstname
    const firstNameInput = page.getByLabel(/Prénom/i);
    await expect(firstNameInput).toBeVisible({ timeout: 5000 });
    await firstNameInput.fill('John');

    // Attendre et remplir le champ lastname
    const lastNameInput = page.getByLabel(/^Nom$/i);
    await lastNameInput.fill('Doe');

    // Attendre et remplir le champ email
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await emailInput.fill('john.doe@example.com');

    // Remplir le mdp
    const passwordInput = page.getByLabel(/^Mot de passe$/i);
    await passwordInput.fill('password123');

    // Remplir le mdp de nouveau
    const passwordToBeSureInput = page.getByLabel(/^Vérifier le mot de passe$/i);
    await passwordToBeSureInput.fill('password123');

    // Je clique
    await page.getByRole('button', { name: /S'enregistrer/i }).click();
    await expect.poll(
      () => page.evaluate(() => localStorage.getItem('token')),
      { timeout: 2000 }
    ).toBe('123456');
    const token = await page.evaluate(() => localStorage.getItem('token'));
    console.log('Afficher le token dans localStorage:', token);
    expect(token).toBe('123456');
  });
});

test.describe('Inscription: erreurs', () => {
  test('Champs vides, email invalide, mdp différents', async ({ page }) => {
    // Mock
    await page.route('**/api/sign-up', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: '123456',
          user: { id: 1,
                  email: 'john.doe@example.com',
                  role: 'admin',
                  firstName: "John",
                  lastName: "Doe"
                }
        })
      });
    });

    // Aller sur /login
    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}sign-up`, { waitUntil: 'networkidle' });

    // Le user clique, sans rien remplir
    await page.getByRole('button', { name: /S'enregistrer/i }).click();
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();

    // email invalide
    await page.getByLabel(/^Email$/i).fill('super@invalid');
    await page.getByRole('button', { name: /s'enregistrer/i }).click();
    await expect(page.getByText(/Email invalide/i)).toBeVisible();

    // Mots de passe qui ne correspondent pas
    await page.getByLabel(/^Mot de passe$/i).fill('password123');
    await page.getByLabel(/^Vérifier le mot de passe$/i).fill('password321');
    await page.getByRole('button', { name: /s'enregistrer/i }).click();
    await expect(page.getByText(/Les mots de passe ne correspondent pas/i)).toBeVisible();
  });
})