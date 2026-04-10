// Test that all SKILL.md files exist and have valid frontmatter
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const SKILLS_DIR = join(import.meta.dirname, "..", "skills", "skill");
const NAME_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---/;

describe("Skill directory structure", () => {
  const skillDirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  it("has at least 8 skills", () => {
    assert.ok(skillDirs.length >= 8, `Expected >= 8 skills, got ${skillDirs.length}`);
  });

  for (const name of skillDirs) {
    describe(name, () => {
      it("has valid name", () => {
        assert.ok(NAME_REGEX.test(name), `Invalid skill name: ${name}`);
      });

      it("has SKILL.md", () => {
        assert.ok(existsSync(join(SKILLS_DIR, name, "SKILL.md")));
      });

      it("has valid frontmatter", () => {
        const content = readFileSync(join(SKILLS_DIR, name, "SKILL.md"), "utf-8");
        const match = content.match(FRONTMATTER_REGEX);
        assert.ok(match, "No frontmatter found");
        assert.ok(match[1].includes("name:"), "Missing name field");
        assert.ok(match[1].includes("description:"), "Missing description field");
      });

      it("name in frontmatter matches directory", () => {
        const content = readFileSync(join(SKILLS_DIR, name, "SKILL.md"), "utf-8");
        const nameMatch = content.match(/^name:\s*(.+)$/m);
        assert.ok(nameMatch, "Could not parse name from frontmatter");
        assert.strictEqual(nameMatch[1].trim(), name);
      });
    });
  }
});

// Prompt validation tests
const PROMPTS_DIR = join(import.meta.dirname, "..", "skills", "prompt");

describe("Prompt directory structure", () => {
  const promptExampleDir = join(PROMPTS_DIR, "example");

  it("has prompt spec", () => {
    assert.ok(existsSync(join(PROMPTS_DIR, "SPEC.md")));
  });

  it("has example prompt with PROMPT.md", () => {
    assert.ok(existsSync(join(promptExampleDir, "PROMPT.md")));
  });

  it("example prompt has valid frontmatter", () => {
    const content = readFileSync(join(promptExampleDir, "PROMPT.md"), "utf-8");
    const match = content.match(FRONTMATTER_REGEX);
    assert.ok(match, "No frontmatter found");
    assert.ok(match[1].includes("name:"), "Missing name field");
    assert.ok(match[1].includes("description:"), "Missing description field");
  });
});
