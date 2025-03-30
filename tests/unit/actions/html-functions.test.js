import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fetchHtml, getTitle, getDescription } from '../utils'

// Load HTML files for testing
const homeHtml = fs.readFileSync(path.resolve(process.cwd(), 'tests/fixtures/html/home.html'), 'utf8')
const aboutHtml = fs.readFileSync(path.resolve(process.cwd(), 'tests/fixtures/html/about.html'), 'utf8')

describe('fetchHtml', () => {
  it('should fetch HTML content successfully', async () => {
    // 関数の実行
    const result = await fetchHtml('https://example.com')

    // 検証
    expect(result).toContain('<!DOCTYPE html>')
    expect(result).toContain('<title>Mock Page for https://example.com</title>')
    expect(result).toContain('<meta name="description" content="This is a mock page for testing">')
  })
})

describe('getTitle', () => {
  it('should extract title from HTML', async () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Test Title</title>
</head>
<body></body>
</html>`
    const result = await getTitle(html)
    expect(result).toBe('Test Title')
  })

  it('should return null when title is not found', async () => {
    const html = `<!DOCTYPE html>
<html>
<head></head>
<body></body>
</html>`
    const result = await getTitle(html)
    expect(result).toBeNull()
  })

  it('should return null when HTML is invalid', async () => {
    const result = await getTitle('invalid html')
    expect(result).toBeNull()
  })
})

describe('getDescription', () => {
  it('should extract description from meta[name="description"]', async () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="description" content="Test Description">
</head>
<body></body>
</html>`
    const result = await getDescription(html)
    expect(result).toBe('Test Description')
  })

  it('should extract description from meta[property="og:description"] as fallback', async () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta property="og:description" content="OG Description">
</head>
<body></body>
</html>`
    const result = await getDescription(html)
    expect(result).toBe('OG Description')
  })

  it('should extract description from meta[name="twitter:description"] as second fallback', async () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="twitter:description" content="Twitter Description">
</head>
<body></body>
</html>`
    const result = await getDescription(html)
    expect(result).toBe('Twitter Description')
  })

  it('should return null when description is not found', async () => {
    const html = `<!DOCTYPE html>
<html>
<head></head>
<body></body>
</html>`
    const result = await getDescription(html)
    expect(result).toBeNull()
  })
})