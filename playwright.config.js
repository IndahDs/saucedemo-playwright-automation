// @ts-check
const { defineConfig } = require('@playwright/test');
const path = require('path');

// Deteksi nama folder skenario dari argumen CLI jika ada (misal: "tests/Skenario Login" -> "Skenario Login")
const scenarioArg = process.argv.find(arg => arg.includes('tests/') || arg.includes('tests\\'));
let scenarioFolder = 'Skenario Login';
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
    timeout: 5000
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
      suiteTitle: true
    }]
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    /* Tampilkan browser saat pengujian dijalankan */
    headless: false,
    /* Perlambat setiap aksi (1000ms = 1 detik) agar interaksi web terlihat jelas */
    launchOptions: {
      slowMo: 1000,
      args: ['--start-maximized'],
    },
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Selalu ambil screenshot di setiap pengujian untuk dilampirkan ke report */
    screenshot: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        viewport: null, // Memungkinkan browser Chromium tampil maximized layar penuh
      },
    },
  ],
});
