import { describe, it, expect, vi, beforeEach } from 'vitest'
import fullAction from '../../src/cli/actions/full.cjs'

// Mock dependencies
vi.mock('undici', () => {
  return {
    request: vi.fn()
  }
})

vi.mock('sitemapper', () => {
  return {
    default: function () {
      return {
        fetch: vi.fn()
      }
    }
  }
})

vi.mock('ora', () => {
  return {
    default: function () {
      return {
        start: vi.fn().mockReturnThis(),
        text: '',
        succeed: vi.fn()
      }
    }
  }
})

describe('full action', () => {
  let consoleSpy
  
  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.clearAllMocks()
  })
  
  it('should be a function', () => {
    expect(typeof fullAction).toBe('function')
  })
  
  it('should handle options correctly', async () => {
    const mockOpts = {
      excludePath: ['**/blog/**'],
      includePath: ['**/docs/**'],
      replaceTitle: ['s/| Test//'],
      title: 'Custom Title',
      description: 'Custom Description'
    }
    
    const action = fullAction.bind({ opts: () => mockOpts })
    await action('https://example.com/sitemap.xml')
    
    expect(consoleSpy).toHaveBeenCalled()
  })
})