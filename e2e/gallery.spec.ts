import { test, expect, type Page } from "@playwright/test";

test.describe("Gallery Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/gallery.html");
  });

  // ─── Page Load ───

  test("renders all 8 skill cards on initial load", async ({ page }) => {
    const cards = page.locator("[data-skill]");
    await expect(cards).toHaveCount(8);
  });

  test("displays correct stat text on load", async ({ page }) => {
    const stat = page.locator("#gallery-stat");
    await expect(stat).toHaveText("8 skills available");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Skill Gallery|SkillsCraft Hub/);
  });

  test("renders hero section with heading", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toHaveText("Skill Gallery");
  });

  // ─── Search ───

  test.describe("Search", () => {
    test("filters cards by name when typing", async ({ page }) => {
      await page.fill("#search", "data-validation");
      // debounce 200ms
      await page.waitForTimeout(300);
      const cards = page.locator("[data-skill]");
      await expect(cards).toHaveCount(1);
      await expect(cards.first()).toHaveAttribute("data-skill", "data-validation");
    });

    test("filters cards by language keyword", async ({ page }) => {
      await page.fill("#search", "python");
      await page.waitForTimeout(300);
      const cards = page.locator("[data-skill]");
      await expect(cards).toHaveCount(1);
      await expect(cards.first()).toHaveAttribute("data-skill", "data-validation");
    });

    test("shows empty state when no results match", async ({ page }) => {
      await page.fill("#search", "nonexistentskill");
      await page.waitForTimeout(300);
      const emptyState = page.locator("#empty-state");
      await expect(emptyState).toBeVisible();
      await expect(emptyState.locator("h3")).toHaveText("No skills match your filters");
    });

    test("highlights matching text in descriptions", async ({ page }) => {
      await page.fill("#search", "validate");
      await page.waitForTimeout(300);
      const mark = page.locator("[data-skill] mark").first();
      await expect(mark).toBeVisible();
    });

    test("shows clear button when search has text", async ({ page }) => {
      const clearBtn = page.locator("#search-clear");
      await expect(clearBtn).toBeHidden();
      await page.fill("#search", "test");
      await page.waitForTimeout(300);
      await expect(clearBtn).toBeVisible();
    });

    test("clears search when clear button clicked", async ({ page }) => {
      await page.fill("#search", "test");
      await page.waitForTimeout(300);
      await page.click("#search-clear");
      await expect(page.locator("#search")).toHaveValue("");
      const cards = page.locator("[data-skill]");
      await expect(cards).toHaveCount(8);
    });

    test("updates stat text when filtering", async ({ page }) => {
      await page.fill("#search", "java");
      await page.waitForTimeout(300);
      const stat = page.locator("#gallery-stat");
      await expect(stat).toContainText("of 8 skills");
    });
  });

  // ─── Language Filters ───

  test.describe("Language Filters", () => {
    test("filters to Python skills when Python clicked", async ({ page }) => {
      await page.click('.filter-btn[data-lang="python"]');
      const cards = page.locator("[data-skill]");
      await expect(cards).toHaveCount(1);
      await expect(cards.first()).toHaveAttribute("data-skill", "data-validation");
    });

    test("filters to Java skills when Java clicked", async ({ page }) => {
      await page.click('.filter-btn[data-lang="java"]');
      const cards = page.locator("[data-skill]");
      await expect(cards).toHaveCount(1);
      await expect(cards.first()).toHaveAttribute("data-skill", "code-quality");
    });

    test("filters to TypeScript skills", async ({ page }) => {
      await page.click('.filter-btn[data-lang="typescript"]');
      const cards = page.locator("[data-skill]");
      await expect(cards).toHaveCount(1);
      await expect(cards.first()).toHaveAttribute("data-skill", "test-generator");
    });

    test("filters to JavaScript skills", async ({ page }) => {
      await page.click('.filter-btn[data-lang="javascript"]');
      const cards = page.locator("[data-skill]");
      await expect(cards).toHaveCount(5);
    });

    test("filters to Bash skills shows empty", async ({ page }) => {
      await page.click('.filter-btn[data-lang="bash"]');
      const emptyState = page.locator("#empty-state");
      await expect(emptyState).toBeVisible();
    });

    test("shows all skills when All clicked after filter", async ({ page }) => {
      await page.click('.filter-btn[data-lang="python"]');
      await expect(page.locator("[data-skill]")).toHaveCount(1);
      await page.click('.filter-btn[data-lang="all"]');
      await expect(page.locator("[data-skill]")).toHaveCount(8);
    });

    test("sets aria-pressed on active filter button", async ({ page }) => {
      const pythonBtn = page.locator('.filter-btn[data-lang="python"]');
      await expect(pythonBtn).toHaveAttribute("aria-pressed", "false");
      await pythonBtn.click();
      await expect(pythonBtn).toHaveAttribute("aria-pressed", "true");
      const allBtn = page.locator('.filter-btn[data-lang="all"]');
      await expect(allBtn).toHaveAttribute("aria-pressed", "false");
    });

    test("shows count in filter buttons", async ({ page }) => {
      const allCount = page.locator('.filter-count[data-count="all"]');
      await expect(allCount).toHaveText("(8)");
      const pythonCount = page.locator('.filter-count[data-count="python"]');
      await expect(pythonCount).toHaveText("(1)");
    });
  });

  // ─── Facet Filters ───

  test.describe("Facet Filters", () => {
    test("filters by scripts/ facet", async ({ page }) => {
      await page.click('.facet-btn[data-facet="scripts"]');
      const cards = page.locator("[data-skill]");
      // All 8 marketplace skills have scripts/
      await expect(cards).toHaveCount(8);
    });

    test("filters by references/ facet", async ({ page }) => {
      await page.click('.facet-btn[data-facet="references"]');
      const cards = page.locator("[data-skill]");
      // Skills with references/: data-validation, test-generator, release-notes, skill-template, project-maintenance, hello-skill
      await expect(cards).toHaveCount(6);
    });

    test("filters by assets/ facet", async ({ page }) => {
      await page.click('.facet-btn[data-facet="assets"]');
      const cards = page.locator("[data-skill]");
      // Skills with assets/: code-quality, hello-skill
      await expect(cards).toHaveCount(2);
    });

    test("filters by tests/ facet", async ({ page }) => {
      await page.click('.facet-btn[data-facet="tests"]');
      const cards = page.locator("[data-skill]");
      // Skills with tests/: hello-skill
      await expect(cards).toHaveCount(1);
    });

    test("combines facet with language filter", async ({ page }) => {
      await page.click('.filter-btn[data-lang="python"]');
      await page.click('.facet-btn[data-facet="scripts"]');
      const cards = page.locator("[data-skill]");
      await expect(cards).toHaveCount(1);
      await expect(cards.first()).toHaveAttribute("data-skill", "data-validation");
    });

    test("toggles facet off on second click", async ({ page }) => {
      await page.click('.facet-btn[data-facet="assets"]');
      await expect(page.locator("[data-skill]")).toHaveCount(2);
      await page.click('.facet-btn[data-facet="assets"]');
      await expect(page.locator("[data-skill]")).toHaveCount(8);
    });

    test("sets aria-pressed on active facet button", async ({ page }) => {
      const scriptsBtn = page.locator('.facet-btn[data-facet="scripts"]');
      await expect(scriptsBtn).toHaveAttribute("aria-pressed", "false");
      await scriptsBtn.click();
      await expect(scriptsBtn).toHaveAttribute("aria-pressed", "true");
    });
  });

  // ─── Sorting ───

  test.describe("Sorting", () => {
    test("sorts by name A-Z by default", async ({ page }) => {
      const firstCard = page.locator("[data-skill]").first();
      await expect(firstCard).toHaveAttribute("data-skill", "code-quality");
    });

    test("sorts by name Z-A", async ({ page }) => {
      await page.selectOption("#sort-select", "name-desc");
      const firstCard = page.locator("[data-skill]").first();
      await expect(firstCard).toHaveAttribute("data-skill", "test-generator");
    });

    test("sorts by language", async ({ page }) => {
      await page.selectOption("#sort-select", "lang");
      const cards = page.locator("[data-skill]");
      // First card should be java (code-quality)
      const firstCard = cards.first();
      await expect(firstCard).toHaveAttribute("data-skill", "code-quality");
    });

    test("sorts by feature count", async ({ page }) => {
      await page.selectOption("#sort-select", "features");
      const firstCard = page.locator("[data-skill]").first();
      const firstName = await firstCard.getAttribute("data-skill");
      // hello-skill has 7 features (most — covers all spec features)
      expect(firstName).toBe("hello-skill");
    });
  });

  // ─── URL State ───

  test.describe("URL State Persistence", () => {
    test("persists language filter in URL", async ({ page }) => {
      await page.click('.filter-btn[data-lang="python"]');
      expect(page.url()).toContain("lang=python");
    });

    test("persists search query in URL", async ({ page }) => {
      await page.fill("#search", "audit");
      await page.waitForTimeout(300);
      expect(page.url()).toContain("q=audit");
    });

    test("persists sort in URL", async ({ page }) => {
      await page.selectOption("#sort-select", "name-desc");
      expect(page.url()).toContain("sort=name-desc");
    });

    test("persists facets in URL", async ({ page }) => {
      await page.click('.facet-btn[data-facet="scripts"]');
      expect(page.url()).toContain("facets=scripts");
    });

    test("restores state from URL on load", async ({ page }) => {
      await page.goto("/gallery?lang=java&q=quality");
      await expect(page.locator("#search")).toHaveValue("quality", { timeout: 10000 });
      await expect(page.locator('.filter-btn[data-lang="java"]')).toHaveAttribute("aria-pressed", "true");
      const cards = page.locator("[data-skill]");
      await expect(cards).toHaveCount(1);
      await expect(cards.first()).toHaveAttribute("data-skill", "code-quality");
    });

    test("cleans URL when all filters cleared", async ({ page }) => {
      await page.click('.filter-btn[data-lang="python"]');
      expect(page.url()).toContain("lang=python");
      await page.click("#clear-all");
      expect(page.url()).not.toContain("lang=");
    });
  });

  // ─── Active Filters Bar ───

  test.describe("Active Filters Bar", () => {
    test("shows active filters bar when filter applied", async ({ page }) => {
      const bar = page.locator("#active-filters");
      await expect(bar).toBeHidden();
      await page.click('.filter-btn[data-lang="python"]');
      await expect(bar).toBeVisible();
    });

    test("shows language tag in active filters", async ({ page }) => {
      await page.click('.filter-btn[data-lang="java"]');
      const tag = page.locator("#active-filter-tags .active-tag");
      await expect(tag).toContainText("java");
    });

    test("shows search query tag in active filters", async ({ page }) => {
      await page.fill("#search", "test");
      await page.waitForTimeout(300);
      const tag = page.locator('#active-filter-tags .active-tag:has-text("test")');
      await expect(tag).toBeVisible();
    });

    test("removes filter when tag X clicked", async ({ page }) => {
      await page.click('.filter-btn[data-lang="python"]');
      await page.click('[data-remove="lang"]');
      await expect(page.locator("[data-skill]")).toHaveCount(8);
      await expect(page.locator('.filter-btn[data-lang="all"]')).toHaveAttribute("aria-pressed", "true");
    });

    test("clears all when Clear all clicked", async ({ page }) => {
      await page.click('.filter-btn[data-lang="python"]');
      await page.fill("#search", "data");
      await page.waitForTimeout(300);
      await page.click("#clear-all");
      await expect(page.locator("[data-skill]")).toHaveCount(8);
      await expect(page.locator("#search")).toHaveValue("");
    });
  });

  // ─── Empty State ───

  test.describe("Empty State", () => {
    test("shows empty state with clear button", async ({ page }) => {
      await page.fill("#search", "zzzznonexistent");
      await page.waitForTimeout(300);
      const emptyState = page.locator("#empty-state");
      await expect(emptyState).toBeVisible();
      const clearBtn = emptyState.locator("button");
      await expect(clearBtn).toBeVisible();
    });

    test("clear button in empty state restores all skills", async ({ page }) => {
      await page.fill("#search", "zzzznonexistent");
      await page.waitForTimeout(300);
      await page.click("#empty-clear");
      await expect(page.locator("[data-skill]")).toHaveCount(8);
      await expect(page.locator("#empty-state")).toBeHidden();
    });
  });

  // ─── Keyboard Shortcuts ───

  test.describe("Keyboard Shortcuts", () => {
    test("/ key focuses search input", async ({ page }) => {
      await page.keyboard.press("/");
      await expect(page.locator("#search")).toBeFocused();
    });

    test("Escape clears search and blurs", async ({ page }) => {
      await page.fill("#search", "test");
      await page.waitForTimeout(300);
      await page.keyboard.press("Escape");
      await expect(page.locator("#search")).toHaveValue("");
      await expect(page.locator("#search")).not.toBeFocused();
    });
  });

  // ─── Accessibility ───

  test.describe("Accessibility", () => {
    test("skip link is present and works", async ({ page }) => {
      const skipLink = page.locator(".skip-link");
      await expect(skipLink).toHaveAttribute("href", "#skill-grid");
    });

    test("nav has aria-label", async ({ page }) => {
      const nav = page.locator('nav[aria-label="Main navigation"]');
      await expect(nav).toBeVisible();
    });

    test("search has aria-label", async ({ page }) => {
      const search = page.locator("#search");
      await expect(search).toHaveAttribute("aria-label", /Search skills/);
    });

    test("filter group has aria-label", async ({ page }) => {
      const group = page.locator('[role="group"][aria-label="Filter by language"]');
      await expect(group).toBeVisible();
    });

    test("skill grid has role=list", async ({ page }) => {
      const grid = page.locator('#skill-grid[role="list"]');
      await expect(grid).toBeVisible();
    });

    test("cards have role=listitem", async ({ page }) => {
      const items = page.locator('[role="listitem"]');
      await expect(items).toHaveCount(8);
    });

    test("gallery stat has aria-live", async ({ page }) => {
      const stat = page.locator("#gallery-stat");
      await expect(stat).toHaveAttribute("aria-live", "polite");
    });

    test("external links have rel=noopener noreferrer", async ({ page }) => {
      const extLinks = page.locator('a[target="_blank"]');
      for (const link of await extLinks.all()) {
        await expect(link).toHaveAttribute("rel", /noopener/);
      }
    });
  });

  // ─── Card Content ───

  test.describe("Card Content", () => {
    test("each card has a name, description, and arrow", async ({ page }) => {
      const firstCard = page.locator("[data-skill]").first();
      await expect(firstCard.locator("code")).toBeVisible();
      await expect(firstCard.locator("p")).toBeVisible();
      await expect(firstCard.locator(".card-arrow")).toBeVisible();
    });

    test("cards with languages show language tags", async ({ page }) => {
      const dataVal = page.locator('[data-skill="data-validation"]');
      await expect(dataVal.locator(".tag-python")).toBeVisible();
    });

    test("cards show complexity badge", async ({ page }) => {
      const hello = page.locator('[data-skill="hello-skill"]');
      await expect(hello.locator(".complexity-badge")).toHaveText("beginner");
    });

    test("cards with compatibility show it", async ({ page }) => {
      const dataVal = page.locator('[data-skill="data-validation"]');
      await expect(dataVal.locator(".skill-compat")).toContainText("Python 3.11+");
    });

    test("cards link to correct GitHub URL", async ({ page }) => {
      const dataVal = page.locator('[data-skill="data-validation"]');
      await expect(dataVal).toHaveAttribute("href", /skills\/skill\/data-validation/);
    });

    test("cards show spec feature badges", async ({ page }) => {
      const dataVal = page.locator('[data-skill="data-validation"]');
      const badges = dataVal.locator(".feature-badge");
      await expect(badges).toHaveCount(4); // metadata, allowed-tools, compatibility, references/
    });
  });

  // ─── Combined Filters ───

  test.describe("Combined Filters", () => {
    test("search + language filter works together", async ({ page }) => {
      await page.click('.filter-btn[data-lang="python"]');
      await page.fill("#search", "validate");
      await page.waitForTimeout(300);
      const cards = page.locator("[data-skill]");
      await expect(cards).toHaveCount(1);
    });

    test("search + facet works together", async ({ page }) => {
      await page.fill("#search", "quality");
      await page.waitForTimeout(300);
      await page.click('.facet-btn[data-facet="assets"]');
      const cards = page.locator("[data-skill]");
      await expect(cards).toHaveCount(1);
      await expect(cards.first()).toHaveAttribute("data-skill", "code-quality");
    });

    test("language + facet + search shows correct results", async ({ page }) => {
      await page.click('.filter-btn[data-lang="typescript"]');
      await page.click('.facet-btn[data-facet="references"]');
      await page.fill("#search", "test");
      await page.waitForTimeout(300);
      const cards = page.locator("[data-skill]");
      await expect(cards).toHaveCount(1);
      await expect(cards.first()).toHaveAttribute("data-skill", "test-generator");
    });

    test("impossible combination shows empty state", async ({ page }) => {
      await page.click('.filter-btn[data-lang="python"]');
      await page.click('.facet-btn[data-facet="assets"]');
      // Python + assets/ = no matches (only Java has assets)
      await expect(page.locator("#empty-state")).toBeVisible();
    });
  });
});
