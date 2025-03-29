import { describe, it, expect } from 'vitest'
import {
  capitalizeString,
  isRootUrl,
  parseSection,
  parseSubstitutionCommand,
  substituteTitle
} from '../utils'

// テスト
describe('capitalizeString', () => {
  it('should capitalize the first letter and lowercase the rest', () => {
    expect(capitalizeString('hello')).toBe('Hello')
    expect(capitalizeString('WORLD')).toBe('World')
    expect(capitalizeString('JavaScript')).toBe('Javascript')
  })

  it('should handle empty strings', () => {
    expect(capitalizeString('')).toBe('')
  })

  it('should handle non-string values', () => {
    expect(capitalizeString(null)).toBe('')
    expect(capitalizeString(undefined)).toBe('')
    expect(capitalizeString(123)).toBe('')
  })
})

describe('isRootUrl', () => {
  it('should return true for root URLs', () => {
    expect(isRootUrl('https://example.com/')).toBe(true)
    expect(isRootUrl('http://example.com/')).toBe(true)
    expect(isRootUrl('https://sub.example.com/')).toBe(true)
  })

  it('should return false for non-root URLs', () => {
    expect(isRootUrl('https://example.com/page')).toBe(false)
    expect(isRootUrl('https://example.com/about')).toBe(false)
    expect(isRootUrl('https://example.com/page?query=value')).toBe(false)
  })

  it('should handle invalid URLs', () => {
    expect(isRootUrl('invalid-url')).toBe(false)
  })
})

describe('parseSection', () => {
  it('should extract the first path segment', () => {
    expect(parseSection('https://example.com/about')).toBe('about')
    expect(parseSection('https://example.com/products/item1')).toBe('products')
    expect(parseSection('https://example.com/blog/2023/01/post')).toBe('blog')
  })

  it('should return "ROOT" for root URLs', () => {
    expect(parseSection('https://example.com/')).toBe('ROOT')
    expect(parseSection('https://example.com')).toBe('ROOT')
  })

  it('should handle invalid URLs', () => {
    expect(parseSection('invalid-url')).toBe('ROOT')
  })
})

describe('parseSubstitutionCommand', () => {
  it('should parse valid substitution commands', () => {
    const result = parseSubstitutionCommand('s/pattern/replacement/')
    expect(result.pattern).toBeInstanceOf(RegExp)
    expect(result.pattern.source).toBe('pattern')
    expect(result.replacement).toBe('replacement')
  })

  it('should handle flags in substitution commands', () => {
    const result = parseSubstitutionCommand('s/pattern/replacement/gi')
    expect(result.pattern).toBeInstanceOf(RegExp)
    expect(result.pattern.source).toBe('pattern')
    expect(result.pattern.flags).toBe('gi')
    expect(result.replacement).toBe('replacement')
  })

  it('should throw an error for invalid commands', () => {
    expect(() => parseSubstitutionCommand('invalid')).toThrow('Invalid substitution command format')
  })
})

describe('substituteTitle', () => {
  it('should substitute patterns in the title', () => {
    expect(substituteTitle('Hello World', 's/World/Universe/')).toBe('Hello Universe')
    // 特殊なケースのテスト
    expect(substituteTitle('Product | Company', 's/\\| Company//')).toBe('Product ')
  })

  it('should handle global substitution', () => {
    expect(substituteTitle('test test test', 's/test/exam/g')).toBe('exam exam exam')
  })

  it('should handle case-insensitive substitution', () => {
    expect(substituteTitle('Hello World', 's/world/Universe/i')).toBe('Hello Universe')
  })

  it('should return the original title for invalid or empty commands', () => {
    expect(substituteTitle('Hello World', '')).toBe('Hello World')
    expect(substituteTitle('Hello World', 'invalid')).toBe('Hello World')
    expect(substituteTitle('Hello World', null)).toBe('Hello World')
  })
})