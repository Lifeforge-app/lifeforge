import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import z from 'zod'

const list = forgeController
  .query()
  .description({
    en: 'Get the list of achievement categories',
    ms: 'Dapatkan senarai kategori pencapaian',
    'zh-CN': '获取成就类别列表',
    'zh-TW': '獲取成就類別列表'
  })
  .input({})
  .callback(async ({ pb }) =>
    pb.getFullList.collection('achievements__categories_aggregated').execute()
  )

const create = forgeController
  .mutation()
  .description({
    en: 'Create a new achievement category',
    ms: 'Cipta kategori pencapaian baharu',
    'zh-CN': '创建新的成就类别',
    'zh-TW': '創建新的成就類別'
  })
  .input({
    body: SCHEMAS.achievements.categories.schema
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('achievements__categories').data(body).execute()
  )

const update = forgeController
  .mutation()
  .description({
    en: 'Update an existing achievement category',
    ms: 'Kemas kini kategori pencapaian sedia ada',
    'zh-CN': '更新现有的成就类别',
    'zh-TW': '更新現有的成就類別'
  })
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.achievements.categories.schema
  })
  .existenceCheck('query', {
    id: 'achievements__categories'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('achievements__categories').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
  .description({
    en: 'Delete an achievement category',
    ms: 'Padam kategori pencapaian',
    'zh-CN': '删除成就类别',
    'zh-TW': '刪除成就類別'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'achievements__categories'
  })
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('achievements__categories').id(id).execute()
  )

export default forgeRouter({ list, create, update, remove })
