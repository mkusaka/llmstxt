import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // テストのグローバル設定
    environment: 'node',
    include: ['tests/**/*.test.js'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    // タイムアウト設定（ミリ秒）
    timeout: 10000,
    // 並列実行設定
    threads: true,
    // カバレッジ設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.config.js',
      ],
      // カバレッジ閾値
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
    // モック設定
    mockReset: true,
  },
})