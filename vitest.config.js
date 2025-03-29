import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Global test settings
    environment: 'node',
    include: ['tests/**/*.test.js'],
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
        '**/*.config.js',
      ],
      // Coverage thresholds
      thresholds: {
        statements: 1,
        branches: 1,
        functions: 1,
        lines: 1,
      },
    },
    // Mock settings
    mockReset: true,
  },
})