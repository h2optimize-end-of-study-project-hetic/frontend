import { test, expect } from '@playwright/test';

test.describe('Authentification avec API mockée', () => {
  test('Connexion OK', async ({ page }) => {
    // Mock de l'API
    await page.route('**/api/me', async route => {
      console.log('Playwright a intercepté /api/login, the best <3');

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(null)
      });
    });

    await page.route('**/api/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: '123456',
          user: { id: 1, email: 'john.doe@example.com', role: 'admin' }
        })
      });
    });

    // Aller sur /login
    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}login`, { waitUntil: 'networkidle' });

    // Attendre et remplir le champ email
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await emailInput.fill('john.doe@example.com');

    // Remplir le mdp
    const passwordInput = page.getByLabel(/mot de passe/i);
    await passwordInput.fill('password123');

    // Je clique
    await page.getByRole('button', { name: /se connecter/i }).click();
    await expect.poll(
      () => page.evaluate(() => localStorage.getItem('token')),
      { timeout: 2000 }
    ).toBe('123456');
    const token = await page.evaluate(() => localStorage.getItem('token'));
    console.log('Afficher le token dans localStorage:', token);
    expect(token).toBe('123456');
  });
});
