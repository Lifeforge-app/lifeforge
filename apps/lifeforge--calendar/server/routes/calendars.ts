import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import ical from 'node-ical'
import z from 'zod'

import { ICalSyncService } from '../functions/icalSyncing'

const list = forgeController
  .query()
  .description({
    en: 'Get all calendars',
    ms: 'Dapatkan semua kalendar',
    'zh-CN': '获取所有日历',
    'zh-TW': '獲取所有日曆'
  })
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('calendar__calendars')
      .sort(['link', 'name'])
      .execute()
  )

const getById = forgeController
  .query()
  .description({
    en: 'Get a specific calendar by ID',
    ms: 'Dapatkan kalendar tertentu mengikut ID',
    'zh-CN': '根据 ID 获取特定日历',
    'zh-TW': '根據 ID 獲取特定日曆'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'calendar__calendars'
  })
  .callback(({ pb, query: { id } }) =>
    pb.getOne.collection('calendar__calendars').id(id).execute()
  )

const create = forgeController
  .mutation()
  .description({
    en: 'Create a new calendar with optional ICS sync',
    ms: 'Cipta kalendar baharu dengan pilihan sinkronisasi ICS',
    'zh-CN': '创建新日历，支持 ICS 同步',
    'zh-TW': '創建新日曆，支持 ICS 同步'
  })
  .input({
    body: SCHEMAS.calendar.calendars.schema
      .pick({
        name: true,
        color: true
      })
      .extend({
        icsUrl: z.url().optional()
      })
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    const newCalendar = await pb.create
      .collection('calendar__calendars')
      .data({
        name: body.name,
        color: body.color,
        link: body.icsUrl ? body.icsUrl : null
      })
      .execute()

    if (body.icsUrl) {
      const icalService = new ICalSyncService(pb)

      await icalService
        .syncCalendar(newCalendar.id, body.icsUrl)
        .catch(console.error)
    }

    return newCalendar
  })

const update = forgeController
  .mutation()
  .description({
    en: 'Update calendar name and color',
    ms: 'Kemas kini nama dan warna kalendar',
    'zh-CN': '更新日历名称和颜色',
    'zh-TW': '更新日曆名稱和顏色'
  })
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.calendar.calendars.schema.pick({
      name: true,
      color: true
    })
  })
  .existenceCheck('query', {
    id: 'calendar__calendars'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('calendar__calendars').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
  .description({
    en: 'Delete a calendar',
    ms: 'Padam kalendar',
    'zh-CN': '删除日历',
    'zh-TW': '刪除日曆'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'calendar__calendars'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('calendar__calendars').id(id).execute()
  )

const validateICS = forgeController
  .mutation()
  .description({
    en: 'Validate if an ICS URL is accessible',
    ms: 'Sahkan jika URL ICS boleh diakses',
    'zh-CN': '验证 ICS URL 是否可访问',
    'zh-TW': '驗證 ICS URL 是否可訪問'
  })
  .input({
    body: z.object({
      icsUrl: z.url()
    })
  })
  .callback(async ({ body: { icsUrl } }) => {
    try {
      const response = await fetch(icsUrl).then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch ICS URL')
        }

        return res.text()
      })

      const parsed = ical.sync.parseICS(response)

      if (Object.keys(parsed).length === 0) {
        throw new Error('No events found in ICS file')
      }

      return true
    } catch {
      return false
    }
  })

export default forgeRouter({
  list,
  getById,
  create,
  update,
  remove,
  validateICS
})
