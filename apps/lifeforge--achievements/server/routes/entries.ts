import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import z from 'zod'

const list = forgeController
  .query()
  .description({
    en: 'Get the list of achievement entries with optional filtering by difficulty, category, or search query',
    ms: 'Dapatkan senarai entri pencapaian dengan penapisan pilihan mengikut kesukaran, kategori, atau carian',
    'zh-CN': '获取成就条目的列表，可选择按难度、类别或搜索查询进行过滤',
    'zh-TW': '獲取成就條目的列表，可選擇按難度、類別或搜索查詢進行過濾'
  })
  .input({
    query: z.object({
      difficulty:
        SCHEMAS.achievements.entries.schema.shape.difficulty.optional(),
      category: z.string().optional(),
      query: z.string().optional()
    })
  })
  .existenceCheck('query', {
    category: '[achievements__categories]'
  })
  .callback(async ({ pb, query: { difficulty, category, query } }) =>
    pb.getFullList
      .collection('achievements__entries')
      .filter([
        difficulty && {
          field: 'difficulty',
          operator: '=',
          value: difficulty
        },
        category
          ? {
              field: 'category',
              operator: '=',
              value: category
            }
          : undefined,
        query
          ? {
              combination: '||',
              filters: [
                {
                  field: 'title',
                  operator: '~',
                  value: query
                },
                {
                  field: 'thoughts',
                  operator: '~',
                  value: query
                }
              ]
            }
          : undefined
      ])
      .sort(['-created'])
      .execute()
  )

const difficultiesCount = forgeController
  .query()
  .description({
    en: 'Get the count of achievement entries grouped by difficulty',
    ms: 'Dapatkan kiraan entri pencapaian yang dikelompokkan mengikut kesukaran',
    'zh-CN': '获取按难度分组的成就条目计数',
    'zh-TW': '獲取按難度分組的成就條目計數'
  })
  .input({})
  .callback(
    async ({ pb }) =>
      Object.fromEntries(
        (
          await pb.getFullList
            .collection('achievements__difficulties_aggregated')
            .execute()
        ).map(item => [item.difficulty, item.count])
      ) as Record<string, number>
  )

const create = forgeController
  .mutation()
  .description({
    en: 'Create a new achievements entry',
    ms: 'Cipta entri pencapaian baharu',
    'zh-CN': '创建新的成就条目',
    'zh-TW': '創建新的成就條目'
  })
  .input({
    body: SCHEMAS.achievements.entries.schema
      .omit({
        created: true,
        updated: true
      })
      .extend({
        category: z.string().optional()
      })
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('achievements__entries').data(body).execute()
  )

const update = forgeController
  .mutation()
  .description({
    en: 'Update an existing achievements entry',
    ms: 'Kemas kini entri pencapaian sedia ada',
    'zh-CN': '更新现有的成就条目',
    'zh-TW': '更新現有的成就條目'
  })
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.achievements.entries.schema
      .omit({
        created: true,
        updated: true
      })
      .extend({
        category: z.string().optional()
      })
  })
  .existenceCheck('query', {
    id: 'achievements__entries'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('achievements__entries').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
  .description({
    en: 'Delete an achievements entry',
    ms: 'Padam entri pencapaian',
    'zh-CN': '删除成就条目',
    'zh-TW': '刪除成就條目'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'achievements__entries'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('achievements__entries').id(id).execute()
  )

export default forgeRouter({
  list,
  difficultiesCount,
  create,
  update,
  remove
})
