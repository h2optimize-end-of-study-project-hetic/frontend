import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export default defineConfig({
  testDir: './src/tests/tests-acceptance',
  use: {
    baseURL: `http://localhost:5173/${process.env.VITE_BASE_PATH}/`,
    headless: process.env.HEADLESS_PLAYWRIGTH !== 'false',
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
});
