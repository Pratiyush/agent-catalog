import { test, expect } from "@playwright/test";

test.describe("Tutorial Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tutorial.html");
  });

  test("loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Tutorial/);
  });

  test("renders main heading", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toContainText("Tutorial");
  });

  test("has Tutorial nav link active", async ({ page }) => {
    const tutorialNav = page.locator('.nav-links a[href="tutorial.html"]');
    await expect(tutorialNav).toHaveClass(/active/);
  });

  test("all h2 section headings present", async ({ page }) => {
    const h2s = page.locator("h2");
    // Tutorial has 13 steps + final = at least 13 h2s
    const count = await h2s.count();
    expect(count).toBeGreaterThanOrEqual(13);
  });

  test("shows Step 1 Install the CLI section", async ({ page }) => {
    const step1 = page.locator("#step-1");
    await expect(step1).toBeVisible();
    await expect(step1.locator("h2")).toContainText("Install the CLI");
  });

  test("shows Step 2 Scaffold section", async ({ page }) => {
    const step2 = page.locator("#step-2");
    await expect(step2).toBeVisible();
    await expect(step2.locator("h2")).toContainText("Scaffold");
  });

  test("shows Step 3 Write SKILL.md section", async ({ page }) => {
    const step3 = page.locator("#step-3");
    await expect(step3).toBeVisible();
    await expect(step3.locator("h2")).toContainText("SKILL.md");
  });

  test("shows final directory structure section", async ({ page }) => {
    const finalSection = page.locator("#final");
    await expect(finalSection).toBeVisible();
  });

  test("code blocks are visible", async ({ page }) => {
    const codeBlocks = page.locator(".code-block");
    const count = await codeBlocks.count();
    expect(count).toBeGreaterThan(5);
    // First code block is visible
    await expect(codeBlocks.first()).toBeVisible();
  });

  test("table of contents links to steps", async ({ page }) => {
    const toc = page.locator(".toc");
    await expect(toc).toBeVisible();
    const links = toc.locator("a");
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThanOrEqual(13);
  });

  test("nav links to Home, Gallery, Tutorial, SDK present", async ({ page }) => {
    const navLinks = page.locator(".nav-links");
    await expect(navLinks.locator('a[href="./"]')).toBeVisible();
    await expect(navLinks.locator('a[href="gallery.html"]')).toBeVisible();
    await expect(navLinks.locator('a[href="tutorial.html"]')).toBeVisible();
    await expect(navLinks.locator('a[href*="agentic-skills-framework"]')).toBeVisible();
  });

  test("SDK link is external with target=_blank", async ({ page }) => {
    const sdkLink = page.locator('.nav-links a[href*="agentic-skills-framework"]');
    await expect(sdkLink).toHaveAttribute("target", "_blank");
    await expect(sdkLink).toHaveAttribute("rel", /noopener/);
  });

  test("theme toggle button is present", async ({ page }) => {
    const toggle = page.locator("#theme-toggle");
    await expect(toggle).toBeVisible();
  });
});
