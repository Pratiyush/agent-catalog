import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:3333",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npx serve docs -l 3333",
    port: 3333,
    reuseExistingServer: !process.env.CI,
  },
});
