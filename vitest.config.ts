import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Global test settings
    environment: 'node',
    include: ['tests/**/*.test.{js,ts}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    // Timeout settings (milliseconds)
    timeout: 10000,
    // Parallel execution settings
    threads: true,
    // Coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.config.{js,ts}',
      ],
      // Coverage thresholds
    },
    // Mock settings
    mockReset: true,
  },
})