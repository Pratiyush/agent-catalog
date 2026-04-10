#!/usr/bin/env node

/**
 * Build-time validation script for Agent Catalog.
 * Discovers and validates all SKILL.md files in skills/.
 * Exits with code 1 if any validation errors are found.
 * Lint warnings are reported but don't fail the build.
 */

import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

const require = createRequire(import.meta.url);
const { parseSkill, validateSkill, lintSkill } = require("@skillscraft/core");

function discoverSkills(baseDir) {
  if (!existsSync(baseDir)) return [];
  const results = [];
  const entries = readdirSync(baseDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillMd = join(baseDir, entry.name, "SKILL.md");
    if (existsSync(skillMd)) {
      results.push(skillMd);
    }
    // Check nested (skills/skill/<name>/SKILL.md)
    const nestedDir = join(baseDir, entry.name);
    try {
      const nested = readdirSync(nestedDir, { withFileTypes: true });
      for (const sub of nested) {
        if (!sub.isDirectory()) continue;
        const nestedSkillMd = join(nestedDir, sub.name, "SKILL.md");
        if (existsSync(nestedSkillMd)) {
          results.push(nestedSkillMd);
        }
      }
    } catch { /* not a directory */ }
  }

  return [...new Set(results)];
}

function discoverPrompts(baseDir) {
  const promptDir = join(baseDir, "prompt");
  if (!existsSync(promptDir)) return [];
  const results = [];
  const entries = readdirSync(promptDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "example") continue;
    const promptMd = join(promptDir, entry.name, "PROMPT.md");
    if (existsSync(promptMd)) {
      results.push(promptMd);
    }
  }

  return results;
}

async function main() {
  const skillPaths = discoverSkills(join(ROOT, "skills"));

  if (skillPaths.length === 0) {
    console.log("No skills found.");
    process.exit(0);
  }

  console.log(`Validating ${skillPaths.length} skill(s)...\n`);

  let passed = 0;
  let failed = 0;
  let warnings = 0;

  for (const skillPath of skillPaths) {
    const relPath = skillPath.slice(ROOT.length + 1);
    try {
      const skill = await parseSkill(skillPath);
      const validation = validateSkill(skill);
      const lint = lintSkill(skill);

      if (!validation.valid) {
        failed++;
        console.log(`  \u2717 ${relPath}`);
        for (const err of validation.errors) {
          console.log(`    [${err.severity}] ${err.message}`);
        }
      } else {
        passed++;
        const w = lint.diagnostics.length;
        if (w > 0) {
          warnings += w;
          const ruleIds = lint.diagnostics
            .map((d) => d.rule || d.id || "unknown")
            .join(", ");
          console.log(`  \u2713 ${relPath} (${w} warning(s): ${ruleIds})`);
        } else {
          console.log(`  \u2713 ${relPath}`);
        }
      }
    } catch (err) {
      failed++;
      console.log(`  \u2717 ${relPath} — ${err.message}`);
    }
  }

  // Validate prompts
  const promptPaths = discoverPrompts(join(ROOT, "skills"));
  if (promptPaths.length > 0) {
    console.log(`\nValidating ${promptPaths.length} prompt(s)...\n`);
    for (const promptPath of promptPaths) {
      const relPath = promptPath.slice(ROOT.length + 1);
      try {
        const content = readFileSync(promptPath, "utf-8");
        const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (!fmMatch) throw new Error("No frontmatter");
        if (!fmMatch[1].includes("name:")) throw new Error("Missing name field");
        if (!fmMatch[1].includes("description:")) throw new Error("Missing description field");
        passed++;
        console.log(`  \u2713 ${relPath}`);
      } catch (err) {
        failed++;
        console.log(`  \u2717 ${relPath} — ${err.message}`);
      }
    }
  }

  console.log(`\n${passed} passed, ${failed} failed, ${warnings} warnings`);

  if (failed > 0) {
    console.error("\nValidation failed. Fix errors above.");
    process.exit(1);
  }

  console.log("\nAll skills valid.");
}

main().catch((err) => {
  console.error("Validation error:", err);
  process.exit(1);
});
