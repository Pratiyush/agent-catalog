// ESLint 9+ flat config for SkillsCraft Hub
// Lints JS/TS skill scripts and build tooling. Java/Python skill scripts are
// excluded via ignores; use their own toolchains (Checkstyle, ruff) instead.

import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierConfig from "eslint-config-prettier";

const nodeGlobals = {
  console: "readonly",
  process: "readonly",
  Buffer: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  globalThis: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
};

const cjsGlobals = {
  ...nodeGlobals,
  require: "readonly",
  module: "readonly",
  exports: "writable",
};

const denoGlobals = {
  ...nodeGlobals,
  Deno: "readonly",
};

export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".turbo/**",
      "docs/**",
      "test-results/**",
      "playwright-report/**",
      "skills/skill/code-quality/scripts/**",
      "skills/skill/data-validation/scripts/**",
    ],
  },

  // Base recommended JS rules
  js.configs.recommended,

  // ESM JavaScript / MJS files (scripts/, dependency-audit/*.mjs)
  {
    files: ["**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: nodeGlobals,
    },
    rules: {
      "prefer-const": "error",
      "no-var": "error",
      "no-useless-assignment": "off",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // CommonJS .js files (skill scripts using require())
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "commonjs",
      globals: cjsGlobals,
    },
    rules: {
      "prefer-const": "error",
      "no-var": "error",
      "no-useless-assignment": "off",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // TypeScript files (includes Deno scripts in test-generator)
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: "module",
      globals: denoGlobals,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "prefer-const": "error",
      "no-var": "error",
      "no-useless-assignment": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Prettier must be last — disables ESLint rules that conflict with Prettier
  prettierConfig,
];
