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
    await page.route("**/api/v1/users", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: sampleUsers }),
      });
    });

    await page.goto(`http://localhost:5173${process.env.VITE_BASE_PATH}admin/dashboard`);
  });

  test("la page s’affiche avec les bons champs et boutons", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Vue Édition" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Vue tableau" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Créer un utilisateur" })).toBeVisible();

    await expect(page.getByText('Nom').first()).toBeVisible();
    await expect(page.getByText('Prénom').first()).toBeVisible();
    await expect(page.getByText('Email').first()).toBeVisible();
    await expect(page.getByText('Rôle').first()).toBeVisible();
    await expect(page.getByText('Numéro de téléphone').first()).toBeVisible();
    await expect(page.getByText('Éditer / Supprimer').first()).toBeVisible();

    await expect(page.getByRole("button", { name: "Éditer" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Supprimer" })).toBeVisible();


  });

  test("au click sur le bouton Éditer, l'admin est redirigé vers la bonne url", async ({ page }) => {
    await page.getByRole("button", { name: "Éditer" }).first().click();

    await expect(page).toHaveURL(/\/admin\/1\/edit-user/);
  });


  test("au click sur le bouton Supprimer, l'admin ne voit plus l'utilisateut", async ({ page }) => {
    await page.getByRole("button", { name: "Supprimer" }).first().click();

    await expect(page.getByText("Bob").first()).not.toBeVisible();
    await expect(page.getByText("Bob")).toHaveCount(0);
  });
});
