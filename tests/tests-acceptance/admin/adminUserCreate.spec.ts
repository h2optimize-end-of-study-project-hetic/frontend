import { test, expect } from "@playwright/test";

test.describe("Création d'un utilisateur", () => {
  test.beforeEach(async ({ page }) => {
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

    // Mock /auth/me
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

    // Mock GET /users
    await page.route("**/api/v1/users", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: [] }),
        });
        return;
      }
      await route.continue();
    });
  });

  test("le formulaire de création s’affiche avec les bons champs", async ({ page }) => {
    await page.goto(
      `http://localhost:5173${process.env.VITE_BASE_PATH}user/create`,
      { waitUntil: "networkidle" }
    );

    await expect(page.getByRole("heading", { name: "Ajoutez une personne" })).toBeVisible();
    await expect(page.getByLabel("Prénom")).toBeVisible();
    await expect(page.getByLabel("Nom").first()).toBeVisible();
    await expect(page.getByLabel("Rôle")).toBeVisible();
    await expect(page.getByLabel("Numéro de téléphone")).toBeVisible();
    await expect(page.getByLabel("Adresse mail")).toBeVisible();
    await expect(page.getByRole("button", { name: "Créer" })).toBeVisible();
  });

  test("création réussie", async ({ page }) => {
    let postCalled = false;

    // Mock POST /users
    await page.route("**/api/v1/users", async (route) => {
      if (route.request().method() === "POST") {
        postCalled = true;

        const body = await route.request().postDataJSON();
        expect(body).toMatchObject({
          firstname: "Bémol",
          lastname: "Cat",
          role: "admin", 
          email: "bemol.cat@gmail.com",
          phone_number: "0678566767",
        });

        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({ id: 1, ...body }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto(
      `http://localhost:5173${process.env.VITE_BASE_PATH}user/create`,
      { waitUntil: "networkidle" }
    );
await page.locator('input[name="firstname"]').fill("Bémol");
await page.locator('input[name="lastname"]').fill("Cat");
    await page.getByLabel("Rôle").click();
    await page.getByRole("option", { name: "admin" }).click();
    await page.getByLabel("Numéro de téléphone").fill("0678566767");
    await page.getByLabel("Adresse mail").fill("bemol.cat@gmail.com");

    // Clique et attend la réponse en parallèle
    const [response] = await Promise.all([
      page.waitForResponse((resp) =>
        resp.url().includes("/api/v1/users") && resp.request().method() === "POST"
      ),
      page.getByRole("button", { name: "Créer" }).click(),
    ]);

    expect(response.ok()).toBeTruthy();
    expect(postCalled).toBe(true);
  });
});
