import { defineConfig, devices } from '@playwright/test';
declare const process: any;

export default defineConfig({
  testDir: './test/e2e',
  timeout: 360000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {

    baseURL: 'http://localhost:8080',
    launchOptions: { slowMo: 3000 },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'go run ./cmd/server',
    url: 'http://localhost:8080/health',
    reuseExistingServer: !process.env.CI,
    timeout: 90000,
  },
});
