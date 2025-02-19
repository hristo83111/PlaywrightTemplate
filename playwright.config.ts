import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  name: 'Conduit Automation',
  timeout: 60000,
  expect: { timeout: 15000 },
  testDir: './tests',
  outputDir: './test-results/',
  workers: Number(process.env.WORKERS) ? Number(process.env.WORKERS) : 4,
  retries: 1,
  reporter: [
    ['html', { outputFolder: './playwright-report/', open: 'never' }],
    ['list']
  ],
  globalSetup: './tests/setup/globalSetup',
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    navigationTimeout: 15000,
    actionTimeout: 15000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    acceptDownloads: true,
    ignoreHTTPSErrors: true
  },
  projects: [
    {
      name: 'conduitSetup',
      testMatch: ['**/*.setup.ts']
    },
    {
      name: 'conduitTeardown',
      testMatch: ['**/*.teardown.ts']
    },
    {
      name: 'Chrome',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--start-fullscreen argument']
        }
      },
      testMatch: ['**/*.spec.ts']
    },
    {
      name: 'RegressionChrome',
      grep: /@regression/,
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--start-fullscreen argument']
        }
      },
      testMatch: ['**/*.spec.ts'],
      teardown: 'conduitTeardown',
      dependencies: ['conduitSetup']
    }
  ]
})
