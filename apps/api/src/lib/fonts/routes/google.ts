import { createCache } from '@functions/cache'
import z from 'zod'

import forge from '../forge'

const googleFontSchema = z.object({
  family: z.string(),
  variants: z.array(z.string()),
  subsets: z.array(z.string()),
  version: z.string(),
  lastModified: z.string(),
  files: z.object({
    regular: z.string().optional(),
    italic: z.string().optional(),
    '500': z.string().optional(),
    '600': z.string().optional(),
    '700': z.string().optional(),
    '800': z.string().optional(),
    '100': z.string().optional(),
    '200': z.string().optional(),
    '300': z.string().optional(),
    '900': z.string().optional(),
    '100italic': z.string().optional(),
    '200italic': z.string().optional(),
    '300italic': z.string().optional(),
    '500italic': z.string().optional(),
    '600italic': z.string().optional(),
    '700italic': z.string().optional(),
    '800italic': z.string().optional(),
    '900italic': z.string().optional()
  }),
  category: z.enum([
    'display',
    'handwriting',
    'monospace',
    'sans-serif',
    'serif'
  ]),
  kind: z.literal('webfonts#webfont'),
  menu: z.string(),
  colorCapabilities: z.array(z.enum(['COLRv0', 'COLRv1', 'SVG'])).optional()
})

type GoogleFontItem = z.infer<typeof googleFontSchema>

type GoogleFontResult = {
  enabled: boolean
  items: GoogleFontItem[]
}

const fontCache = createCache<GoogleFontResult>('google-fonts', {
  stdTTL: 86400
})

export const list = forge
  .query({
    description: 'Retrieve available Google Fonts',
    input: {},
    output: {
      OK: z.object({
        enabled: z.boolean(),
        items: z.array(googleFontSchema)
      })
    }
  })
  .callback(
    async ({
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      const cached = fontCache.get('listGoogleFonts')

      if (cached) {
        return response.ok(cached)
      }

      const key = await getAPIKey('gcloud')

      if (!key) {
        return response.ok({
          enabled: false,
          items: []
        })
      }

      const target = `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}`

      const r = await fetch(target)

      const data = await r.json()

      const result: GoogleFontResult = {
        enabled: true,
        items: data.items
      }

      fontCache.set('listGoogleFonts', result)

      return response.ok(result)
    }
  )

export const get = forge
  .query({
    description: 'Get details of a specific Google Font',
    input: {
      query: z.object({
        family: z.string()
      })
    },
    output: {
      OK: z.object({
        enabled: z.boolean(),
        items: z.array(googleFontSchema).optional()
      })
    }
  })
  .callback(
    async ({
      query: { family },
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      const cacheKey = `getGoogleFont:${family}`

      const cached = fontCache.get(cacheKey)

      if (cached) {
        return response.ok(cached)
      }

      const key = await getAPIKey('gcloud').catch(() => null)

      if (!key) {
        return response.ok({
          enabled: false
        })
      }

      const target = `https://www.googleapis.com/webfonts/v1/webfonts?family=${encodeURIComponent(family)}&key=${key}`

      const r = await fetch(target)

      const data = await r.json()

      const result: GoogleFontResult = {
        enabled: true,
        items: data.items
      }

      fontCache.set(cacheKey, result)

      return response.ok(result)
    }
  )
