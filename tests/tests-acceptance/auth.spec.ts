import { test, expect } from '@playwright/test';

test.describe('Authentification avec API mockée', () => {
  test('Connexion OK', async ({ page }) => {
    // Mock /api/me
    await page.route('**/api/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          email: 'john.doe@example.com',
          username: 'John',
          lastname: 'Doe',
          role: 'admin',
          disabled: false
        }),
      });
    });

    // Mock /api/login : access_token
    await page.route('**/api/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: '123456',
          token_type: 'bearer',
        }),
      });
    });

    // Ouvre la page de login
    await page.goto('http://localhost:5173/release/login', { waitUntil: 'networkidle' });

    // Remplis le formulaire
    await expect(page.getByLabel(/email/i)).toBeVisible({ timeout: 5000 });
    await page.getByLabel(/email/i).fill('john.doe@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');

    // Clique sur le bouton
    const [loginResp] = await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/login') && r.request().method() === 'POST'),
      page.getByRole('button', { name: /se connecter/i }).click(),
    ]);
    expect(loginResp.ok()).toBeTruthy();

    // Vérifie que le token est bien stocké
    await expect.poll(
      () => page.evaluate(() => localStorage.getItem('token')),
      { timeout: 3000, intervals: [100, 200, 400, 800, 1500] }
    ).toBe('123456');

    const token = await page.evaluate(() => localStorage.getItem('token'));
    console.log('Token dans localStorage:', token);
    expect(token).toBe('123456');
  });
});
