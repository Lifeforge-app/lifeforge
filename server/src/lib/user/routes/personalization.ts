import NodeCache from 'node-cache'
import z from 'zod'

import forge from '../forge'

const fontCache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 })

interface FontFamily {
  family: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: Date
  files: Files
  category: Category
  kind: Kind
  menu: string
  colorCapabilities?: ColorCapability[]
}

enum Category {
  Display = 'display',
  Handwriting = 'handwriting',
  Monospace = 'monospace',
  SansSerif = 'sans-serif',
  Serif = 'serif'
}

enum ColorCapability {
  COLRv0 = 'COLRv0',
  COLRv1 = 'COLRv1',
  SVG = 'SVG'
}

interface Files {
  regular?: string
  italic?: string
  '500'?: string
  '600'?: string
  '700'?: string
  '800'?: string
  '100'?: string
  '200'?: string
  '300'?: string
  '900'?: string
  '100italic'?: string
  '200italic'?: string
  '300italic'?: string
  '500italic'?: string
  '600italic'?: string
  '700italic'?: string
  '800italic'?: string
  '900italic'?: string
}

enum Kind {
  WebfontsWebfont = 'webfonts#webfont'
}

export const listGoogleFonts = forge
  .query({
    description: 'Retrieve available Google Fonts',
    input: {},
    output: {
      OK: z.object({
        enabled: z.boolean(),
        items: z.array(z.any())
      })
    }
  })
  .callback(
    async ({
      pb,
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      const cached = fontCache.get<{ enabled: boolean; items: FontFamily[] }>(
        'listGoogleFonts'
      )

      if (cached) {
        return response.ok(cached)
      }

      const key = await getAPIKey('gcloud', pb)

      if (!key) {
        return response.ok({
          enabled: false,
          items: []
        })
      }

      const target = `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}`

      const r = await fetch(target)

      const data = await r.json()

      const result = {
        enabled: true,
        items: data.items as FontFamily[]
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
      pb,
      query: { family },
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      const cacheKey = `getGoogleFont:${family}`

      const cached = fontCache.get<{ enabled: boolean; items?: unknown }>(
        cacheKey
      )

      if (cached) {
        return response.ok(cached)
      }

      const key = await getAPIKey('gcloud', pb).catch(() => null)

      if (!key) {
        return response.ok({
          enabled: false
        })
      }

      const target = `https://www.googleapis.com/webfonts/v1/webfonts?family=${encodeURIComponent(family)}&key=${key}`

      const r = await fetch(target)

      const data = await r.json()

      const result = {
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
  .callback(async ({ pb, response }) => {
    if (!pb.instance.authStore.record) {
      return response.unauthorized()
    }

    const record = await pb.getOne
      .collection('users')
      .id(pb.instance.authStore.record.id)
      .execute()

    return response.ok((record.pinnedFontFamilies || []) as string[])
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
      OK: z.void(),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ pb, body: { family }, response }) => {
    if (!pb.instance.authStore.record) {
      return response.unauthorized()
    }

    const record = await pb.getOne
      .collection('users')
      .id(pb.instance.authStore.record.id)
      .execute()

    const pinnedFontFamilies: string[] = record.pinnedFontFamilies || []

    const updatedPinnedFontFamilies = pinnedFontFamilies.includes(family)
      ? pinnedFontFamilies.filter(f => f !== family)
      : [...pinnedFontFamilies, family]

    await pb.update
      .collection('users')
      .id(pb.instance.authStore.record.id)
      .data({
        pinnedFontFamilies: updatedPinnedFontFamilies
      })
      .execute()

    return response.ok()
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
        collectionId: z.string(),
        recordId: z.string(),
        fieldId: z.string()
      })
    }
  })
  .callback(
    async ({
      pb,
      media: { file },
      core: {
        media: { retrieveMedia }
      },
      response
    }) => {
      const newRecord = await pb.update
        .collection('users')
        .id(pb.instance.authStore.record!.id)
        .data({
          ...(await retrieveMedia('bgImage', file)),
          backdropFilters: {
            brightness: 100,
            blur: 'none',
            contrast: 100,
            saturation: 100,
            overlayOpacity: 50
          }
        })
        .execute()

      return response.ok({
        collectionId: newRecord.collectionId,
        recordId: newRecord.id,
        fieldId: newRecord.bgImage
      })
    }
  )

export const deleteBgImage = forge
  .mutation({
    description: 'Remove background image',
    input: {},
    output: {
      OK: z.void()
    }
  })
  .callback(async ({ pb, response }) => {
    await pb.update
      .collection('users')
      .id(pb.instance.authStore.record!.id)
      .data({
        bgImage: null
      })
      .execute()

    return response.ok()
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
      OK: z.void(),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ pb, body: { data }, response }) => {
    const toBeUpdated: { [key: string]: unknown } = {}

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

    await pb.update
      .collection('users')
      .id(pb.instance.authStore.record!.id)
      .data(toBeUpdated)
      .execute()

    return response.ok()
  })
