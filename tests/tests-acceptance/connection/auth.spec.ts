import { test, expect } from '@playwright/test';

test.describe('Authentification via useAuth', () => {
  test('Connexion réussie avec API mockée', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: '123456',
          user: {
            id: 1,
            email: 'bemol.lecat@example.com',
            role: 'admin',
          },
        }),
      });
    });

    // Mock de la route me
    await page.route('**/api/v1/auth/me', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          email: 'bemol.lecat@example.com',
          role: 'admin',
        }),
      });
    });

    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });

    await page.getByLabel(/email/i).fill('bemol.lecat@example.com');
    await page.locator('input[type="password"]').fill('miaou');

    await page.getByRole('button', { name: /se connecter/i }).click();

    // Await token stocké
    await expect.poll(
      () => page.evaluate(() => localStorage.getItem('token')),
      { timeout: 2000 }
    ).toBe('123456');

    await expect(page).toHaveURL(/.*dashboard/);
  });
});
