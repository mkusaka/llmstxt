import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

describe('llmstxt CLI', () => {
  it('should display help information', async () => {
    const { stdout } = await execAsync('node src/cli/llmstxt.js --help')
    
    expect(stdout).toContain('Usage: llmstxt [options] [command]')
    expect(stdout).toContain('convert `sitemap.xml` to `llms.txt`')
    expect(stdout).toContain('Commands:')
    expect(stdout).toContain('gen [options] [url]')
  })

  it('should display version information', async () => {
    const { stdout } = await execAsync('node src/cli/llmstxt.js --version')
    
    // package.jsonからバージョンを取得
    const packageJson = require('../../../package.json')
    
    expect(stdout.trim()).toBe(packageJson.version)
  })

  it('should display gen command help information', async () => {
    const { stdout } = await execAsync('node src/cli/llmstxt.js gen --help')
    
    expect(stdout).toContain('Usage: llmstxt gen [options] [url]')
    expect(stdout).toContain('generate llms.txt')
    expect(stdout).toContain('Arguments:')
    expect(stdout).toContain('url')
    expect(stdout).toContain('Options:')
    expect(stdout).toContain('--exclude-path')
    expect(stdout).toContain('--include-path')
    expect(stdout).toContain('--replace-title')
    expect(stdout).toContain('--title')
    expect(stdout).toContain('--description')
  })
})