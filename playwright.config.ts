import { defineConfig, devices } from '@playwright/test';

const AUTH_FILE = 'e2e/.auth/user.json';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3001',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'auth',
      testMatch: /auth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'authenticated',
      testIgnore: [/auth\.spec\.ts/, /auth\.setup\.ts/, /\.mobile\.spec\.ts/],
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
    },
    {
      name: 'mobile',
      testMatch: /\.mobile\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Pixel 7'], storageState: AUTH_FILE },
    },
  ],
});
