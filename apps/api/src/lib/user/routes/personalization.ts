import { createCache } from '@functions/cache'
import { eq } from 'drizzle-orm'
import z from 'zod'

import forge from '../forge'
import { users } from '../schema.drizzle'

const googleFontItemSchema = z.object({
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

type GoogleFontItem = z.infer<typeof googleFontItemSchema>

type GoogleFontResult = {
  enabled: boolean
  items: GoogleFontItem[]
}

const fontCache = createCache<GoogleFontResult>('google-fonts', {
  stdTTL: 86400
})

export const listGoogleFonts = forge
  .query({
    description: 'Retrieve available Google Fonts',
    input: {},
    output: {
      OK: z.object({
        enabled: z.boolean(),
        items: z.array(googleFontItemSchema)
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

      const key = await getAPIKey('gcloud').catch(() => null)

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

export const getGoogleFont = forge
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
        items: z.any().optional()
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

export const listGoogleFontsPin = forge
  .query({
    description: 'Retrieve pinned Google Fonts',
    input: {},
    output: {
      OK: z.array(z.string()),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ db, response }) => {
    const user = await db.query.users.findFirst()

    if (!user) {
      return response.unauthorized()
    }

    return response.ok((user.pinnedFontFamilies || []) as string[])
  })

export const toggleGoogleFontsPin = forge
  .mutation({
    description: 'Pin or unpin a Google Font',
    input: {
      body: z.object({
        family: z.string()
      })
    },
    output: {
      NO_CONTENT: true,
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ db, body: { family }, response }) => {
    const user = await db.query.users.findFirst()

    if (!user) {
      return response.unauthorized()
    }

    const pinnedFontFamilies: string[] = (user.pinnedFontFamilies ||
      []) as string[]

    const updatedPinnedFontFamilies = pinnedFontFamilies.includes(family)
      ? pinnedFontFamilies.filter(f => f !== family)
      : [...pinnedFontFamilies, family]

    await db
      .update(users)
      .set({
        pinnedFontFamilies: updatedPinnedFontFamilies,
        updated: new Date()
      })
      .where(eq(users.id, user.id))

    return response.noContent()
  })

export const updateBgImage = forge
  .mutation({
    description: 'Upload new background image',
    input: {},
    media: {
      file: {
        optional: false
      }
    },
    output: {
      OK: z.object({
        key: z.string()
      }),
      BAD_REQUEST: z.string(),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ db, media: { file }, core, response }) => {
    if (typeof file === 'string') {
      return response.badRequest('A valid background image must be uploaded')
    }

    const user = await db.query.users.findFirst()

    if (!user) {
      return response.unauthorized()
    }

    const bgImageKey = await core.storage.save({
      file,
      currentKey: user.bgImage || undefined,
      table: 'users',
      field: 'bgImage'
    })

    if (!bgImageKey) {
      return response.badRequest('Failed to save background image')
    }

    await db
      .update(users)
      .set({
        bgImage: bgImageKey,
        backdropFilters: {
          brightness: 100,
          blur: 'none',
          contrast: 100,
          saturation: 100,
          overlayOpacity: 50
        },
        updated: new Date()
      })
      .where(eq(users.id, user.id))

    return response.ok({
      key: bgImageKey
    })
  })

export const deleteBgImage = forge
  .mutation({
    description: 'Remove background image',
    input: {},
    output: {
      NO_CONTENT: true,
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ db, core, response }) => {
    const user = await db.query.users.findFirst()

    if (!user) {
      return response.unauthorized()
    }

    if (user.bgImage) {
      await core.storage.delete(user.bgImage)
    }

    await db
      .update(users)
      .set({
        bgImage: null,
        updated: new Date()
      })
      .where(eq(users.id, user.id))

    return response.noContent()
  })

export const updatePersonalization = forge
  .mutation({
    description: 'Update user personalization preferences',
    input: {
      body: z.object({
        data: z.object({
          fontFamily: z.string().optional(),
          theme: z.string().optional(),
          color: z.string().optional(),
          bgTemp: z.string().optional(),
          language: z.string().optional(),
          fontScale: z.number().optional(),
          borderRadiusMultiplier: z.number().optional(),
          bordered: z.boolean().optional(),
          dashboardLayout: z.record(z.string(), z.any()).optional(),
          backdropFilters: z.record(z.string(), z.any()).optional()
        })
      })
    },
    output: {
      NO_CONTENT: true,
      BAD_REQUEST: z.string(),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ db, body: { data }, response }) => {
    const user = await db.query.users.findFirst()

    if (!user) {
      return response.unauthorized()
    }

    const toBeUpdated: Record<string, unknown> = {}

    for (const item of [
      'fontFamily',
      'theme',
      'color',
      'bgTemp',
      'language',
      'fontScale',
      'borderRadiusMultiplier',
      'bordered',
      'dashboardLayout',
      'backdropFilters'
    ]) {
      if (data[item as keyof typeof data] !== undefined) {
        toBeUpdated[item] = data[item as keyof typeof data]
      }
    }

    if (!Object.keys(toBeUpdated).length) {
      return response.badRequest('No data to update')
    }

    toBeUpdated.updated = new Date()

    await db.update(users).set(toBeUpdated).where(eq(users.id, user.id))

    return response.noContent()
  })
