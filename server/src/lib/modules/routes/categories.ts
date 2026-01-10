import z from 'zod'

import { forgeController } from '@functions/routes'
import TempFileManager from '@functions/utils/tempFileManager'

const categoryOrderFile = new TempFileManager('categoryOrder.json', 'array')

export const list = forgeController
  .query()
  .description({
    en: 'Get the category display order',
    ms: 'Dapatkan urutan paparan kategori',
    'zh-CN': '获取类别显示顺序',
    'zh-TW': '獲取類別顯示順序'
  })
  .input({})
  .callback(async () => categoryOrderFile.read<string[]>())

export const update = forgeController
  .mutation()
  .description({
    en: 'Update the category display order',
    ms: 'Kemas kini urutan paparan kategori',
    'zh-CN': '更新类别显示顺序',
    'zh-TW': '更新類別顯示順序'
  })
  .input({
    body: z.object({
      categoryOrder: z.array(z.string())
    })
  })
  .callback(async ({ body: { categoryOrder } }) => {
    categoryOrderFile.write(JSON.stringify(categoryOrder))

    return { success: true }
  })
