import { getAPIKey } from '@functions/database'
import getMedia from '@functions/external/media'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import z from 'zod'

export interface FontFamily {
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

export enum Category {
  Display = 'display',
  Handwriting = 'handwriting',
  Monospace = 'monospace',
  SansSerif = 'sans-serif',
  Serif = 'serif'
}

export enum ColorCapability {
  COLRv0 = 'COLRv0',
  COLRv1 = 'COLRv1',
  SVG = 'SVG'
}

export interface Files {
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

export enum Kind {
  WebfontsWebfont = 'webfonts#webfont'
}

const listGoogleFonts = forgeController
  .query()
  .description('List available Google Fonts')
  .input({})
  .callback(async ({ pb }) => {
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
  })

const getGoogleFont = forgeController
  .query()
  .description('Get specific Google Font details')
  .input({
    query: z.object({
      family: z.string()
    })
  })
  .callback(async ({ pb, query: { family } }) => {
    const key = await getAPIKey('gcloud', pb)

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
  })

const updateBgImage = forgeController
  .mutation()
  .description('Update background image')
  .input({})
  .media({
    file: {
      optional: false
    }
  })
  .callback(async ({ pb, media: { file } }) => {
    const newRecord = await pb.update
      .collection('user__users')
      .id(pb.instance.authStore.record!.id)
      .data({
        ...(await getMedia('bgImage', file)),
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
  })

const deleteBgImage = forgeController
  .mutation()
  .description('Delete background image')
  .input({})
  .statusCode(204)
  .callback(({ pb }) =>
    pb.update
      .collection('user__users')
      .id(pb.instance.authStore.record!.id)
      .data({
        bgImage: null
      })
      .execute()
  )

const updatePersonalization = forgeController
  .mutation()
  .description('Update personalization settings')
  .input({
    body: z.object({
      data: z.object({
        fontFamily: z.string().optional(),
        theme: z.string().optional(),
        color: z.string().optional(),
        bgTemp: z.string().optional(),
        language: z.string().optional(),
        fontScale: z.number().optional(),
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
      'dashboardLayout',
      'backdropFilters'
    ]) {
      if (data[item as keyof typeof data]) {
        toBeUpdated[item] = data[item as keyof typeof data]
      }
    }

    if (!Object.keys(toBeUpdated).length) {
      throw new ClientError('No data to update')
    }

    await pb.update
      .collection('user__users')
      .id(pb.instance.authStore.record!.id)
      .data(toBeUpdated)
      .execute()
  })

export default forgeRouter({
  listGoogleFonts,
  getGoogleFont,
  updateBgImage,
  deleteBgImage,
  updatePersonalization
})
