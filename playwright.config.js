// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();
function buildBaseUrl() {
  const env = process.env.PLAYWRIGHT_BASE_URL;
  if (env && /^https?:\/\//.test(env)) return env;
  const host = process.env.TETRIS_APP_HOST || '127.0.0.1';
  const port = process.env.TETRIS_APP_PORT || '8080';
  const path = process.env.TETRIS_APP_PATH ? `/${process.env.TETRIS_APP_PATH.replace(/^\/|\/$/g, '')}` : '';
  const url = `http://${host}:${port}${path}`;
  if (!/^https?:\/\//.test(url)) throw new Error(`PLAYWRIGHT baseURL inválido: ${url}`);
  return url;
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
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
    baseURL: buildBaseUrl(),
    headless: true,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
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
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: `mkdocs serve --dev-addr ${process.env.TETRIS_APP_HOST}:${process.env.TETRIS_APP_PORT}`,
    url: `http://${process.env.TETRIS_APP_HOST}:${process.env.TETRIS_APP_PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
