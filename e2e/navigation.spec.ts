import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("Home -> Gallery navigation", async ({ page }) => {
    await page.goto("/");
    await page.locator('.nav-links a[href="gallery.html"]').first().click();
    await page.waitForLoadState("domcontentloaded");
    // serve may rewrite gallery.html -> gallery
    await expect(page).toHaveURL(/gallery(\.html)?$/);
    await expect(page.locator("h1")).toHaveText("Skill Gallery");
  });

  test("Gallery -> Tutorial navigation", async ({ page }) => {
    await page.goto("/gallery.html");
    await page.locator('.nav-links a[href="tutorial.html"]').first().click();
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveURL(/tutorial(\.html)?$/);
    await expect(page.locator("h1").first()).toContainText("Tutorial");
  });

  test("Tutorial -> Home navigation", async ({ page }) => {
    await page.goto("/tutorial.html");
    await page.locator('.nav-links a[href="./"]').first().click();
    await page.waitForLoadState("domcontentloaded");
    // After clicking href="./" we may land at / or /index.html
    expect(page.url()).toMatch(/\/$|\/index\.html$/);
    await expect(page.locator("h1").first()).toHaveText("Agent Catalog");
  });

  test("SDK link is external (target=_blank) on all pages", async ({ page }) => {
    const pages = ["/", "/gallery.html", "/tutorial.html"];
    for (const p of pages) {
      await page.goto(p);
      const sdk = page.locator('.nav-links a[href*="agentic-skills-framework"]');
      await expect(sdk).toHaveAttribute("target", "_blank");
      await expect(sdk).toHaveAttribute("rel", /noopener/);
    }
  });

  test("GitHub nav link is external with target=_blank on all pages", async ({ page }) => {
    const pages = ["/", "/gallery.html", "/tutorial.html"];
    for (const p of pages) {
      await page.goto(p);
      const gh = page.locator(".nav-github");
      await expect(gh).toHaveAttribute("target", "_blank");
      await expect(gh).toHaveAttribute("rel", /noopener/);
    }
  });

  test("theme toggle works on home page", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    // Click toggle and verify data-theme changes to dark (or light)
    await page.click("#theme-toggle");
    const theme1 = await html.getAttribute("data-theme");
    expect(theme1 === "dark" || theme1 === "light").toBeTruthy();
    await page.click("#theme-toggle");
    const theme2 = await html.getAttribute("data-theme");
    expect(theme2 === "dark" || theme2 === "light").toBeTruthy();
    // Themes should differ between toggles
    expect(theme2).not.toEqual(theme1);
  });

  test("theme toggle works on gallery page", async ({ page }) => {
    await page.goto("/gallery.html");
    const html = page.locator("html");
    await page.click("#theme-toggle");
    const theme1 = await html.getAttribute("data-theme");
    expect(theme1 === "dark" || theme1 === "light").toBeTruthy();
  });

  test("theme toggle works on tutorial page", async ({ page }) => {
    await page.goto("/tutorial.html");
    const html = page.locator("html");
    await page.click("#theme-toggle");
    const theme1 = await html.getAttribute("data-theme");
    expect(theme1 === "dark" || theme1 === "light").toBeTruthy();
  });

  test("theme persists across navigation via localStorage", async ({ page }) => {
    await page.goto("/");
    await page.click("#theme-toggle");
    const homeTheme = await page.locator("html").getAttribute("data-theme");
    await page.goto("/gallery.html");
    const galleryTheme = await page.locator("html").getAttribute("data-theme");
    expect(galleryTheme).toEqual(homeTheme);
  });

  test("brand link returns to home from gallery", async ({ page }) => {
    await page.goto("/gallery.html");
    await page.locator(".nav-brand").click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toMatch(/\/$|\/index\.html$/);
  });

  test("brand link returns to home from tutorial", async ({ page }) => {
    await page.goto("/tutorial.html");
    await page.locator(".nav-brand").click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toMatch(/\/$|\/index\.html$/);
  });
});
