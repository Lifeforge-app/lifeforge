import z from 'zod'

import getMedia from '@functions/external/media'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'

const VALID_FONT_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2']

function isValidFontFile(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'))

  return VALID_FONT_EXTENSIONS.includes(ext)
}

const list = forgeController
  .query()
  .description({
    en: 'List all custom uploaded fonts',
    ms: 'Senaraikan semua fon tersuai yang dimuat naik',
    'zh-CN': '列出所有上传的自定义字体',
    'zh-TW': '列出所有上傳的自訂字體'
  })
  .input({})
  .callback(async ({ pb }) => {
    const records = await pb.getFullList
      .collection('user__font_family_upload')
      .execute()

    return records.map(record => ({
      id: record.id,
      displayName: record.displayName,
      family: record.family,
      weight: record.weight,
      file: record.file,
      collectionId: record.collectionId
    }))
  })

const get = forgeController
  .query()
  .description({
    en: 'Get a specific custom font by ID',
    ms: 'Dapatkan fon tersuai tertentu mengikut ID',
    'zh-CN': '通过ID获取特定自定义字体',
    'zh-TW': '透過ID獲取特定自訂字體'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'user__font_family_upload'
  })
  .callback(async ({ pb, query: { id } }) => {
    const record = await pb.getOne
      .collection('user__font_family_upload')
      .id(id)
      .execute()

    return {
      id: record.id,
      displayName: record.displayName,
      family: record.family,
      weight: record.weight,
      file: record.file,
      collectionId: record.collectionId
    }
  })

const upload = forgeController
  .mutation()
  .description({
    en: 'Upload a new custom font',
    ms: 'Muat naik fon tersuai baharu',
    'zh-CN': '上传新的自定义字体',
    'zh-TW': '上傳新的自訂字體'
  })
  .input({
    query: z.object({
      id: z.string().optional()
    }),
    body: z.object({
      displayName: z.string().min(1, 'Display name is required'),
      family: z.string().min(1, 'Font family is required'),
      weight: z.number().min(100).max(900).default(400)
    })
  })
  .media({
    file: {
      optional: false
    }
  })
  .existenceCheck('query', {
    id: '[user__font_family_upload]'
  })
  .callback(
    async ({
      pb,
      query: { id },
      body: { displayName, family, weight },
      media: { file }
    }) => {
      // Validate file type on server side
      if (file instanceof File) {
        if (!isValidFontFile(file.name)) {
          throw new ClientError(
            'Invalid file type. Only TTF, OTF, WOFF, and WOFF2 files are allowed.',
            400
          )
        }
      }

      const record = id
        ? await pb.update
            .collection('user__font_family_upload')
            .id(id)
            .data({
              displayName,
              family,
              weight,
              ...(await getMedia('file', file))
            })
            .execute()
        : await pb.create
            .collection('user__font_family_upload')
            .data({
              displayName,
              family,
              weight,
              ...(await getMedia('file', file))
            })
            .execute()

      return {
        id: record.id,
        displayName: record.displayName,
        family: record.family,
        weight: record.weight,
        file: record.file,
        collectionId: record.collectionId
      }
    }
  )

const deleteFont = forgeController
  .mutation()
  .description({
    en: 'Delete a custom font',
    ms: 'Padam fon tersuai',
    'zh-CN': '删除自定义字体',
    'zh-TW': '刪除自訂字體'
  })
  .input({
    body: z.object({
      id: z.string()
    })
  })
  .statusCode(204)
  .callback(async ({ pb, body: { id } }) => {
    await pb.delete.collection('user__font_family_upload').id(id).execute()
  })

export default forgeRouter({
  list,
  get,
  upload,
  delete: deleteFont
})
