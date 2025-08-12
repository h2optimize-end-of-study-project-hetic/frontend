import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests-acceptance/**',
      '**/src/tests/tests-acceptance/**'
    ],
  },
});
