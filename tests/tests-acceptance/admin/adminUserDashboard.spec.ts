import { test, expect } from "@playwright/test";

test.describe("Dashboard – Vue tableau de l'admin", () => {
  const sampleUsers = [
    {
      id: 1,
      firstname: "Bob",
      lastname: "Bobby",
      email: "bobby@gmail.com",
      phone_number: "0688787878",
      role: "admin",
    },
  ];

  test.beforeEach(async ({ page }) => {
    // localStorage pour un admin connecté
    await page.addInitScript(() => {
      localStorage.setItem("token", "bearer-fake-123");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 1,
          firstname: "Admin",
          lastname: "Test",
          email: "admin@test.fr",
          role: "admin",
        })
      );
    });

    // Mock utilisateur authent
    await page.route("**/api/v1/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          email: "admin@test.fr",
          role: "admin",
        }),
      });
    });

    // Mock fauxutilisateur 
    await page.route("**/api/v1/users", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: sampleUsers }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}user/dashboard`, {
      waitUntil: "networkidle",
    });
  });

test("la page s’affiche avec les bons champs et boutons", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Vue Édition" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Vue tableau" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Créer un utilisateur" })).toBeVisible();

  await expect(page.getByText("Nom", { exact: true })).toBeVisible();
  await expect(page.getByText("Prénom", { exact: true })).toBeVisible();
  await expect(page.getByText("Email", { exact: true })).toBeVisible();
  await expect(page.getByText("Rôle", { exact: true })).toBeVisible();
  await expect(page.getByText("Numéro de téléphone", { exact: true })).toBeVisible();
  await expect(page.getByText("Éditer / Supprimer", { exact: true })).toBeVisible();

  await expect(page.getByRole("button", { name: "Éditer" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Supprimer" })).toBeVisible();
});


  test("au clic sur Éditer, l'admin est redirigé vers la page d'édition", async ({ page }) => {
    await page.getByRole("button", { name: "Éditer" }).first().click();
    await expect(page).toHaveURL(/\/user\/1\/edit-user/);
  });

  test("au clic sur Supprimer, l'utilisateur n'apparaît plus dans la liste", async ({ page }) => {
  await page.route("**/api/v1/users/1", async (route) => {
    if (route.request().method() === "DELETE") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
      return;
    }
    await route.continue();
  });

  await page.getByRole("button", { name: "Supprimer" }).first().click();

  await expect(page.getByText("Bob", { exact: true })).toHaveCount(0);
});

});
