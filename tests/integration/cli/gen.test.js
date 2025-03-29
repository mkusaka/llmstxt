import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// コンソール出力をモック
const originalConsoleLog = console.log
beforeEach(() => {
  console.log = vi.fn()
})

afterEach(() => {
  console.log = originalConsoleLog
  vi.resetAllMocks()
})

// モックgen関数のインポート
import gen from './mock-gen'

describe('gen command', () => {
  it('should generate llms.txt with default options', async () => {
    // コマンドオプションのモック
    const options = {
      opts: () => ({})
    }

    // gen関数を実行
    await gen.call(options, 'https://example.com/sitemap.xml')

    // コンソール出力を検証
    expect(console.log).toHaveBeenCalled()
    
    // 出力内容を取得
    const output = console.log.mock.calls[0][0]
    
    // 出力内容を検証
    expect(output).toContain('# Mock Page for https://example.com/')
    expect(output).toContain('> This is a mock page for testing')
    expect(output).toContain('## About')
    expect(output).toContain('## Products')
  })

  it('should exclude paths based on exclude-path option', async () => {
    // コマンドオプションのモック
    const options = {
      opts: () => ({
        excludePath: ['**/blog/**']
      })
    }

    // gen関数を実行
    await gen.call(options, 'https://example.com/sitemap.xml')

    // コンソール出力を検証
    expect(console.log).toHaveBeenCalled()
    
    // 出力内容を取得
    const output = console.log.mock.calls[0][0]
    
    // 出力内容を検証
    expect(output).not.toContain('## Blog')
  })

  it('should include only specified paths based on include-path option', async () => {
    // コマンドオプションのモック
    const options = {
      opts: () => ({
        includePath: ['**/about']
      })
    }

    // gen関数を実行
    await gen.call(options, 'https://example.com/sitemap.xml')

    // コンソール出力を検証
    expect(console.log).toHaveBeenCalled()
    
    // 出力内容を取得
    const output = console.log.mock.calls[0][0]
    
    // 出力内容を検証
    expect(output).toContain('## About')
    expect(output).not.toContain('## Products')
  })

  it('should replace title based on replace-title option', async () => {
    // コマンドオプションのモック
    const options = {
      opts: () => ({
        replaceTitle: ['s/\\| Example Website//']
      })
    }

    // gen関数を実行
    await gen.call(options, 'https://example.com/sitemap.xml')

    // コンソール出力を検証
    expect(console.log).toHaveBeenCalled()
    
    // 出力内容を取得
    const output = console.log.mock.calls[0][0]
    
    // 出力内容を検証
    expect(output).not.toContain('| Example Website')
  })

  it('should use custom title and description when provided', async () => {
    // コマンドオプションのモック
    const options = {
      opts: () => ({
        title: 'Custom Title',
        description: 'Custom Description'
      })
    }

    // gen関数を実行
    await gen.call(options, 'https://example.com/sitemap.xml')

    // コンソール出力を検証
    expect(console.log).toHaveBeenCalled()
    
    // 出力内容を取得
    const output = console.log.mock.calls[0][0]
    
    // 出力内容を検証
    expect(output).toContain('# Custom Title')
    expect(output).toContain('> Custom Description')
  })
})