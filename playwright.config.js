// @ts-check
const { defineConfig } = require('@playwright/test');
const path = require('path');

// Detect scenario folder name from CLI arguments if present (e.g., "tests/Login Scenarios" -> "Login Scenarios")
const scenarioArg = process.argv.find(arg => arg.includes('tests/') || arg.includes('tests\\'));
let scenarioFolder = 'Login Scenarios';
if (scenarioArg) {
  const match = scenarioArg.match(/tests[/\\]([^/\\]+)/);
  if (match && match[1]) {
    scenarioFolder = match[1];
  }
}
if (process.env.ALLURE_SCENARIO) {
  scenarioFolder = process.env.ALLURE_SCENARIO;
}

const allureOutputFolder = path.join('allure-results', scenarioFolder);
process.env.ALLURE_RESULTS_DIR = allureOutputFolder;

module.exports = defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  /* Run tests sequentially with 1 worker so browser window is clearly visible */
  fullyParallel: false,
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', {
      detail: true,
      resultsDir: allureOutputFolder,
      suiteTitle: true,
    }],
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    /* Display browser window during test execution */
    headless: false,
    /* Slow down actions slightly (1000ms = 1s) so interactions are clearly visible */
    launchOptions: {
      slowMo: 1000,
      args: ['--start-maximized'],
    },
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Always capture screenshot for every test to attach to the report */
    screenshot: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        viewport: null, // Allow Chromium browser to display maximized in full screen
      },
    },
  ],
});
