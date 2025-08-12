import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './src/tests/tests-acceptance',
  use: {
    baseURL: `http://localhost:5173/${process.env.VITE_BASE_PATH}/`,
    headless: true,
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
});
