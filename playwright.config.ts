import { defineConfig, devices, Project } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

interface ProjectConfig {
  name: string;
  browser: "chromium" | "firefox" | "webkit";
  baseURL: string;
}

export const projects: ProjectConfig[] = [
  {
    name: "en-chrome",
    browser: "chromium",
    baseURL: "https://www.ploom.co.uk/en",
  },
  {
    name: "en-firefox",
    browser: "firefox",
    baseURL: "https://www.ploom.co.uk/en",
  },
  {
    name: "pl-chrome",
    browser: "chromium",
    baseURL: "https://www.ploom.pl/pl",
  },
  {
    name: "pl-firefox",
    browser: "firefox",
    baseURL: "https://www.ploom.pl/pl",
  },
];
// const baseURL = "https://www.ploom.co.uk/en";
// const baseURL = "https://www.ploom.pl/pl";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },
  expect: {
    timeout: 10000, // Sets default assertion timeout to 10 seconds
  },
  globalSetup: "./global-setup.ts",

  /* Configure projects for major browsers */
  projects: projects.map(({ name, browser, baseURL }) => ({
    name,
    use: {
      browserName: browser,
      baseURL: baseURL,
      storageState: `./storageStates/${name}.json`,
    },
  })),
  // {
  //   name: "chromium",
  //   use: { ...devices["Desktop Chrome"] },
  // },

  // {
  //   name: 'firefox',
  //   use: { ...devices['Desktop Firefox'] },
  // },

  // {
  //   name: 'webkit',
  //   use: { ...devices['Desktop Safari'] },
  // },

  /* Test against mobile viewports. */
  // {
  //   name: 'Mobile Chrome',
  //   use: { ...devices['Pixel 5'] },
  // },
  // {
  //   name: 'Mobile Safari',
  //   use: { ...devices['iPhone 12'] },
  // },

  /* Test against branded browsers. */
  // {
  //   name: 'Microsoft Edge',
  //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
  // },
  // {
  //   name: 'Google Chrome',
  //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  // },

  /* Test against specific locales */

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
