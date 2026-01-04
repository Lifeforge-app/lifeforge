import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { SCHEMAS } from '@schema'
import z from 'zod'

const list = forgeController
  .query()
  .description({
    en: 'Get all event categories',
    ms: 'Dapatkan semua kategori acara',
    'zh-CN': '获取所有事件类别',
    'zh-TW': '獲取所有事件類別'
  })
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('calendar__categories').sort(['name']).execute()
  )

const getById = forgeController
  .query()
  .description({
    en: 'Get a specific event category by ID',
    ms: 'Dapatkan kategori acara tertentu mengikut ID',
    'zh-CN': '根据 ID 获取特定事件类别',
    'zh-TW': '根據 ID 獲取特定事件類別'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'calendar__categories'
  })
  .callback(({ pb, query: { id } }) =>
    pb.getOne.collection('calendar__categories').id(id).execute()
  )

const create = forgeController
  .mutation()
  .description({
    en: 'Create a new event category',
    ms: 'Cipta kategori acara baharu',
    'zh-CN': '创建新事件类别',
    'zh-TW': '創建新事件類別'
  })
  .input({
    body: SCHEMAS.calendar.categories.schema
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    if (body.name.startsWith('_')) {
      throw new ClientError('Category name cannot start with _')
    }

    return await pb.create
      .collection('calendar__categories')
      .data(body)
      .execute()
  })

const update = forgeController
  .mutation()
  .description({
    en: 'Update event category details',
    ms: 'Kemas kini butiran kategori acara',
    'zh-CN': '更新事件类别详情',
    'zh-TW': '更新事件類別詳情'
  })
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.calendar.categories.schema
  })
  .existenceCheck('query', {
    id: 'calendar__categories'
  })
  .callback(async ({ pb, query: { id }, body }) => {
    if (body.name.startsWith('_')) {
      throw new ClientError('Category name cannot start with _')
    }

    return await pb.update
      .collection('calendar__categories')
      .id(id)
      .data(body)
      .execute()
  })

const remove = forgeController
  .mutation()
  .description({
    en: 'Delete an event category',
    ms: 'Padam kategori acara',
    'zh-CN': '删除事件类别',
    'zh-TW': '刪除事件類別'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'calendar__categories'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('calendar__categories').id(id).execute()
  )

export default forgeRouter({
  list,
  getById,
  create,
  update,
  remove
})
