import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@functions/database/dbUtils'
import { forgeController, forgeRouter } from '@functions/routes'

const list = forgeController
  .query()
  .description({
    en: 'Retrieve all database collections',
    ms: 'Dapatkan semua koleksi pangkalan data',
    'zh-CN': '获取所有数据库集合',
    'zh-TW': '獲取所有資料庫集合'
  })
  .input({})
  .callback(async () => {
    const pb = await connectToPocketBase(validateEnvironmentVariables())

    const collections = await pb.collections.getFullList()

    return collections
      .filter(e => ['base', 'view'].includes(e.type) && !e.system)
      .map(collection => ({
        name: collection.name,
        type: collection.type as 'base' | 'view',
        fields: collection.fields
          .filter(e => !e.system && !e.hidden)
          .map(field => ({
            name: field.name,
            type: field.type,
            optional: !field.required,
            options: field.values || undefined
          }))
      }))
  })

export default forgeRouter({ list })
