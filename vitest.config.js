import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    setupFiles: [],
    include: ['tests/**/*.{test,spec}.js']
  }
});
