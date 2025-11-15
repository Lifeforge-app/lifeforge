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
  .description({
    en: 'Retrieve available Google Fonts',
    ms: 'Dapatkan fon Google yang tersedia',
    'zh-CN': '获取可用的Google字体',
    'zh-TW': '獲取可用的Google字體'
  })
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
  .description({
    en: 'Get details of a specific Google Font',
    ms: 'Dapatkan butiran fon Google tertentu',
    'zh-CN': '获取特定Google字体详情',
    'zh-TW': '獲取特定Google字體詳情'
  })
  .input({
    query: z.object({
      family: z.string()
    })
  })
  .callback(async ({ pb, query: { family } }) => {
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
  })

const listGoogleFontsPin = forgeController
  .query()
  .description({
    en: 'Retrieve pinned Google Fonts',
    ms: 'Dapatkan fon Google yang disemat',
    'zh-CN': '获取已固定的Google字体',
    'zh-TW': '獲取已固定的Google字體'
  })
  .input({})
  .callback(async ({ pb }) => {
    if (!pb.instance.authStore.record) {
      throw new ClientError('Unauthorized', 401)
    }

    const record = await pb.getOne
      .collection('user__users')
      .id(pb.instance.authStore.record.id)
      .execute()

    return (record.pinnedFontFamilies || []) as string[]
  })

const toggleGoogleFontsPin = forgeController
  .mutation()
  .description({
    en: 'Pin or unpin a Google Font',
    ms: 'Semat atau nyahsemat fon Google',
    'zh-CN': '固定或取消固定Google字体',
    'zh-TW': '固定或取消固定Google字體'
  })
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
      .collection('user__users')
      .id(pb.instance.authStore.record.id)
      .execute()

    const pinnedFontFamilies: string[] = record.pinnedFontFamilies || []

    const updatedPinnedFontFamilies = pinnedFontFamilies.includes(family)
      ? pinnedFontFamilies.filter(f => f !== family)
      : [...pinnedFontFamilies, family]

    await pb.update
      .collection('user__users')
      .id(pb.instance.authStore.record.id)
      .data({
        pinnedFontFamilies: updatedPinnedFontFamilies
      })
      .execute()
  })

const updateBgImage = forgeController
  .mutation()
  .description({
    en: 'Upload new background image',
    ms: 'Muat naik imej latar belakang baharu',
    'zh-CN': '上传新的背景图片',
    'zh-TW': '上傳新的背景圖片'
  })
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
  .description({
    en: 'Remove background image',
    ms: 'Alih keluar imej latar belakang',
    'zh-CN': '移除背景图片',
    'zh-TW': '移除背景圖片'
  })
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
  .description({
    en: 'Update user personalization preferences',
    ms: 'Kemas kini keutamaan pemperibadian pengguna',
    'zh-CN': '更新用户个性化偏好',
    'zh-TW': '更新用戶個性化偏好'
  })
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
  listGoogleFontsPin,
  toggleGoogleFontsPin,
  updateBgImage,
  deleteBgImage,
  updatePersonalization
})
