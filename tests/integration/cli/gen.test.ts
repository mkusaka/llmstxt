import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock console output
const originalConsoleLog = console.log;
beforeEach(() => {
  console.log = vi.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
  vi.resetAllMocks();
});

// Import mock gen function
import gen from './mock-gen';

interface MockOptions {
  opts: () => {
    excludePath?: string[];
    includePath?: string[];
    replaceTitle?: string[];
    title?: string;
    description?: string;
  };
}

describe('gen command', () => {
  it('should generate llms.txt with default options', async () => {
    // Mock command options
    const options: MockOptions = {
      opts: () => ({})
    };

    // gen関数を実行
    await gen.call(options, 'https://example.com/sitemap.xml');

    // コンソール出力を検証
    expect(console.log).toHaveBeenCalled();
    
    // 出力内容を取得
    const output = (console.log as any).mock.calls[0][0];
    
    // 出力内容を検証
    expect(output).toContain('# Mock Page for https://example.com/');
    expect(output).toContain('> This is a mock page for testing');
    expect(output).toContain('## About');
    expect(output).toContain('## Products');
  });

  it('should exclude paths based on exclude-path option', async () => {
    // Mock command options
    const options: MockOptions = {
      opts: () => ({
        excludePath: ['**/blog/**']
      })
    };

    // gen関数を実行
    await gen.call(options, 'https://example.com/sitemap.xml');

    // コンソール出力を検証
    expect(console.log).toHaveBeenCalled();
    
    // 出力内容を取得
    const output = (console.log as any).mock.calls[0][0];
    
    // 出力内容を検証
    expect(output).not.toContain('## Blog');
  });

  it('should include only specified paths based on include-path option', async () => {
    // Mock command options
    const options: MockOptions = {
      opts: () => ({
        includePath: ['**/about']
      })
    };

    // gen関数を実行
    await gen.call(options, 'https://example.com/sitemap.xml');

    // コンソール出力を検証
    expect(console.log).toHaveBeenCalled();
    
    // 出力内容を取得
    const output = (console.log as any).mock.calls[0][0];
    
    // 出力内容を検証
    expect(output).toContain('## About');
    expect(output).not.toContain('## Products');
  });

  it('should replace title based on replace-title option', async () => {
    // Mock command options
    const options: MockOptions = {
      opts: () => ({
        replaceTitle: ['s/\\| Example Website//']
      })
    };

    // gen関数を実行
    await gen.call(options, 'https://example.com/sitemap.xml');

    // コンソール出力を検証
    expect(console.log).toHaveBeenCalled();
    
    // 出力内容を取得
    const output = (console.log as any).mock.calls[0][0];
    
    // 出力内容を検証
    expect(output).not.toContain('| Example Website');
  });

  it('should use custom title and description when provided', async () => {
    // Mock command options
    const options: MockOptions = {
      opts: () => ({
        title: 'Custom Title',
        description: 'Custom Description'
      })
    };

    // gen関数を実行
    await gen.call(options, 'https://example.com/sitemap.xml');

    // コンソール出力を検証
    expect(console.log).toHaveBeenCalled();
    
    // 出力内容を取得
    const output = (console.log as any).mock.calls[0][0];
    
    // 出力内容を検証
    expect(output).toContain('# Custom Title');
    expect(output).toContain('> Custom Description');
  });
});