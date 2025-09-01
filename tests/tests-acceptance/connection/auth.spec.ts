// import { test, expect } from '@playwright/test';

// test.describe('Authentification avec API mockée', () => {
//   test('Connexion OK', async ({ page }) => {
//     // Interception de /api/login
//     await page.route('**/api/login', async route => {
//       await route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify({
//           access_token: '123456',
//           user: {
//             id: 1,
//             email: 'john.doe@example.com',
//             role: 'admin',
//           },
//         }),
//       });
//     });

//     // Interception de /api/me
//     await page.route('**/api/me', async route => {
//       await route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//         body: JSON.stringify({
//           id: 1,
//           email: 'john.doe@example.com',
//           role: 'admin',
//         }),
//       });
//     });

//     // Navigation vers la page de login
//     await page.goto('http://localhost:5173/release/login', { waitUntil: 'networkidle' });

//     // Remplissage du formulaire
//     await page.getByLabel(/email/i).fill('john.doe@example.com');
//     await page.getByLabel(/mot de passe/i).fill('password123');

//     // Clic sur le bouton
//     await page.getByRole('button', { name: /se connecter/i }).click();

//     // Vérifie que access_token a bien été stocké
//     await expect.poll(
//       () => page.evaluate(() => localStorage.getItem('access_token')),
//       { timeout: 2000 }
//     ).toBe('123456');

//     const token = await page.evaluate(() => localStorage.getItem('access_token'));
//     console.log(' Token stocké :', token);
//   });
// });
