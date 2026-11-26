import { defineConfig, devices } from '@playwright/test';

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
  testDir: './tests',
  timeout: 60000, // Give each test 60 seconds instead of 30
  expect: {
    timeout: 10000, // Give assertions 10 seconds to wait for slow API responses
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
      ['list'],
      ['html', { open: 'never' }],
      ['allure-playwright', {
            resultsDir: 'allure-results',
            detail: true,
            suiteTitle: false,
      }],
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on', // 'retain-on-failure' to keep traces only for failed tests. And 
                 // 'on-first-retry' to keep traces for the first retry of failed tests.
                 // 'on' to always keep traces for all tests.
  },

  /* Configure projects for major browsers */
  projects: [
      {
            name: 'setup',
            testMatch: /.*\.setup\.(spec\.)?ts/,
      },
      {
            name: 'chromium',
            dependencies: ['setup'],
            testIgnore: /.*\.setup\.(spec\.)?ts/,
      },
      {
            name: 'firefox',
            dependencies: ['setup'],
            testIgnore: /.*\.setup\.(spec\.)?ts/,
      },
      {
            name: 'webkit',
            dependencies: ['setup'],
            testIgnore: /.*\.setup\.(spec\.)?ts/,
      },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
