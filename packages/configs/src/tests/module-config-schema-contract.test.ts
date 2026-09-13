import { describe, expect, it } from 'vitest'

// Import the compiled schema from dist to avoid React type resolution issues
const { moduleConfigSchema } = await import('../../dist/index.js')

describe('moduleConfigSchema contract fields', () => {
  describe('contractVersion', () => {
    it('accepts a valid semver string', () => {
      const result = moduleConfigSchema.safeParse({
        routes: { '/': {} },
        contractVersion: '1.0.0'
      })

      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.contractVersion).toBe('1.0.0')
      }
    })

    it('omits contractVersion when absent', () => {
      const result = moduleConfigSchema.safeParse({ routes: { '/': {} } })

      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.contractVersion).toBeUndefined()
      }
    })

    it('rejects non-string values', () => {
      const result = moduleConfigSchema.safeParse({
        routes: { '/': {} },
        contractVersion: 123
      })
      expect(result.success).toBe(false)
    })
  })

  describe('contract', () => {
    it('accepts a normalized operation catalog', () => {
      const catalog = {
        entries: {
          list: {
            method: 'get',
            description: 'List items',
            noAuth: false,
            encrypted: true,
            isDownloadable: false,
            media: null,
            input: {},
            output: { OK: { type: 'array', items: { type: 'string' } } }
          }
        }
      }

      const result = moduleConfigSchema.safeParse({
        routes: { '/': {} },
        contract: catalog
      })

      expect(result.success).toBe(true)
    })

    it('omits contract when absent', () => {
      const result = moduleConfigSchema.safeParse({ routes: { '/': {} } })

      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.data.contract).toBeUndefined()
      }
    })
  })

  describe('existing manifest compatibility', () => {
    it('accepts a minimal manifest with only routes', () => {
      const result = moduleConfigSchema.safeParse({ routes: { '/': {} } })

      expect(result.success).toBe(true)
    })

    it('rejects a manifest missing required routes field', () => {
      const result = moduleConfigSchema.safeParse({})

      expect(result.success).toBe(false)
    })

    it('accepts a full manifest with contract and contractVersion', () => {
      const result = moduleConfigSchema.safeParse({
        routes: { '/': {} },
        hidden: false,
        clearQueryOnUnmount: true,
        contract: { entries: {} },
        contractVersion: '1.0.0',
        widgets: []
      })

      expect(result.success).toBe(true)
    })
  })
})
