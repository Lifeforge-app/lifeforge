import { ClientError } from '@lifeforge/server-utils'
import z from 'zod'

import forge from '../forge'

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
  .query()
  .description('Retrieve available Google Fonts')
  .input({})
  .callback(
    async ({
      pb,
      core: {
        api: { getAPIKey }
      }
    }) => {
      const key = await getAPIKey('gcloud', pb)

      if (!key) {
        return {
          enabled: false,
          items: []
        }
      }

      const target = `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}`

      const response = await fetch(target)

      const data = await response.json()

      return {
        enabled: true,
        items: data.items as FontFamily[]
      }
    }
  )

export const getGoogleFont = forge
  .query()
  .description('Get details of a specific Google Font')
  .input({
    query: z.object({
      family: z.string()
    })
  })
  .callback(
    async ({
      pb,
      query: { family },
      core: {
        api: { getAPIKey }
      }
    }) => {
      const key = await getAPIKey('gcloud', pb).catch(() => null)

      if (!key) {
        return {
          enabled: false
        }
      }

      const target = `https://www.googleapis.com/webfonts/v1/webfonts?family=${encodeURIComponent(family)}&key=${key}`

      const response = await fetch(target)

      const data = await response.json()

      return {
        enabled: true,
        items: data.items
      }
    }
  )

export const listGoogleFontsPin = forge
  .query()
  .description('Retrieve pinned Google Fonts')
  .input({})
  .callback(async ({ pb }) => {
    if (!pb.instance.authStore.record) {
      throw new ClientError('Unauthorized', 401)
    }

    const record = await pb.getOne
      .collection('users')
      .id(pb.instance.authStore.record.id)
      .execute()

    return (record.pinnedFontFamilies || []) as string[]
  })

export const toggleGoogleFontsPin = forge
  .mutation()
  .description('Pin or unpin a Google Font')
  .input({
    body: z.object({
      family: z.string()
    })
  })
  .statusCode(204)
  .callback(async ({ pb, body: { family } }) => {
    if (!pb.instance.authStore.record) {
      throw new ClientError('Unauthorized', 401)
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
  })

export const updateBgImage = forge
  .mutation()
  .description('Upload new background image')
  .input({})
  .media({
    file: {
      optional: false
    }
  })
  .callback(
    async ({
      pb,
      media: { file },
      core: {
        media: { retrieveMedia }
      }
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

      return {
        collectionId: newRecord.collectionId,
        recordId: newRecord.id,
        fieldId: newRecord.bgImage
      }
    }
  )

export const deleteBgImage = forge
  .mutation()
  .description('Remove background image')
  .input({})
  .statusCode(204)
  .callback(({ pb }) =>
    pb.update
      .collection('users')
      .id(pb.instance.authStore.record!.id)
      .data({
        bgImage: null
      })
      .execute()
  )

export const updatePersonalization = forge
  .mutation()
  .description('Update user personalization preferences')
  .input({
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
  })
  .statusCode(204)
  .callback(async ({ pb, body: { data } }) => {
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
      throw new ClientError('No data to update')
    }

    await pb.update
      .collection('users')
      .id(pb.instance.authStore.record!.id)
      .data(toBeUpdated)
      .execute()
  })
