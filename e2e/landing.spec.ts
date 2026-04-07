import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/SkillsCraft Hub/);
  });

  test("renders hero with brand heading", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toHaveText("SkillsCraft Hub");
  });

  test("hero search has correct form action and submits to gallery", async ({ page }) => {
    // The form must point to gallery.html via GET so it shows up in URL params
    const form = page.locator(".hero-search");
    await expect(form).toHaveAttribute("action", "gallery.html");
    await expect(form).toHaveAttribute("method", "get");
    const input = page.locator(".hero-search-input");
    await expect(input).toHaveAttribute("name", "q");
    // Submitting navigates to gallery (the static server may strip the .html
    // and/or rewrite the URL on submit, but the form contract is the part we
    // care about — the input is named "q" so query params will be preserved
    // when the page is loaded directly).
    await input.fill("release-notes");
    await Promise.all([
      page.waitForLoadState("domcontentloaded"),
      page.locator('.hero-search button[type="submit"]').click(),
    ]);
    // After submit we should be on the gallery page (with or without .html)
    expect(page.url()).toMatch(/gallery(\.html)?/);
    await expect(page.locator("h1")).toHaveText("Skill Gallery");
  });

  test("hero search query is preserved on direct gallery load", async ({ page }) => {
    // Use clean URL to avoid serve.dev clean-URL redirect that strips query strings
    await page.goto("/gallery?q=release-notes");
    await expect(page.locator("#search")).toHaveValue("release-notes");
    const cards = page.locator("[data-skill]");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toHaveAttribute("data-skill", "release-notes");
  });

  test("stats show 8 Skills, 5 Languages, 33+ Compatible Agents", async ({ page }) => {
    const statNumbers = page.locator(".stat-number");
    await expect(statNumbers.nth(0)).toHaveText("8");
    await expect(statNumbers.nth(1)).toHaveText("5");
    await expect(statNumbers.nth(2)).toHaveText("33+");

    const statLabels = page.locator(".stat-label");
    await expect(statLabels.nth(0)).toHaveText("Skills");
    await expect(statLabels.nth(1)).toHaveText("Languages");
    await expect(statLabels.nth(2)).toHaveText("Compatible Agents");
  });

  test("featured skills cards link to gallery filtered", async ({ page }) => {
    const featured = page.locator(".card-featured");
    await expect(featured).toHaveCount(3);
    // Each featured card should point to gallery.html?q=<name>
    const hrefs = await featured.evaluateAll((els) =>
      els.map((el) => (el as HTMLAnchorElement).getAttribute("href"))
    );
    for (const href of hrefs) {
      expect(href).toMatch(/^gallery\.html\?q=/);
    }
  });

  test("install tabs switch correctly: Claude -> Copilot -> Codex -> Generic", async ({ page }) => {
    const tabClaude = page.locator('.install-tab[data-tab="claude"]');
    const tabCopilot = page.locator('.install-tab[data-tab="copilot"]');
    const tabCodex = page.locator('.install-tab[data-tab="codex"]');
    const tabGeneric = page.locator('.install-tab[data-tab="generic"]');

    // Initially Claude active
    await expect(tabClaude).toHaveClass(/active/);
    await expect(page.locator("#panel-claude")).toHaveClass(/active/);

    // Switch to Copilot
    await tabCopilot.click();
    await expect(tabCopilot).toHaveClass(/active/);
    await expect(tabCopilot).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#panel-copilot")).toHaveClass(/active/);
    await expect(page.locator("#panel-claude")).not.toHaveClass(/active/);

    // Switch to Codex
    await tabCodex.click();
    await expect(tabCodex).toHaveClass(/active/);
    await expect(page.locator("#panel-codex")).toHaveClass(/active/);

    // Switch to Generic
    await tabGeneric.click();
    await expect(tabGeneric).toHaveClass(/active/);
    await expect(page.locator("#panel-generic")).toHaveClass(/active/);
  });

  test("copy-to-clipboard buttons exist with correct data-target", async ({ page }) => {
    const targets = ["claude", "copilot", "codex", "generic"];
    for (const t of targets) {
      const btn = page.locator(`.copy-btn[data-target="${t}"]`);
      await expect(btn).toHaveCount(1);
    }
  });

  test("install section shows code blocks for each target", async ({ page }) => {
    const panels = ["panel-claude", "panel-copilot", "panel-codex", "panel-generic"];
    for (const id of panels) {
      const panel = page.locator(`#${id}`);
      await expect(panel).toHaveCount(1);
      await expect(panel.locator(".code-block")).toHaveCount(1);
    }
  });

  test("categories section shows 4 asset types", async ({ page }) => {
    const categoriesSection = page.locator('.section:has(h2:has-text("Categories"))');
    await expect(categoriesSection.locator(".card")).toHaveCount(4);
    await expect(categoriesSection).toContainText("Skills");
    await expect(categoriesSection).toContainText("Prompts");
    await expect(categoriesSection).toContainText("Agents");
    await expect(categoriesSection).toContainText("MCP Servers");
  });

  test("footer link to GitHub repo", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.locator('a[href*="skillscraft-hub"]')).toBeVisible();
  });
});
