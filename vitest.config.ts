// vite.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    watch: false,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
