import { getAPIKey } from '@functions/database'
import { fetchAI } from '@functions/external/ai'
import searchLocations from '@functions/external/location'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { Location } from '@lib/locations/typescript/location.types'
import { SCHEMAS } from '@schema'
import fs from 'fs'
import moment from 'moment'
import z from 'zod'

import getEvents from '../functions/getEvents'

const CreateAndUpdateEventSchema = SCHEMAS.calendar.events.schema
  .omit({
    type: true,
    location: true,
    location_coords: true,
    created: true,
    updated: true,
    calendar: true
  })
  .extend({
    calendar: z.string().optional(),
    location: Location.optional()
  })
  .and(
    z.union([
      z
        .object({
          type: z.literal('single')
        })
        .and(
          SCHEMAS.calendar.events_single.schema.omit({
            base_event: true
          })
        ),
      z.object({
        type: z.literal('recurring'),
        rrule: z.string()
      })
    ])
  )

const getByDateRange = forgeController
  .query()
  .description({
    en: 'Get events within a date range',
    ms: 'Dapatkan acara dalam julat tarikh',
    'zh-CN': '获取日期范围内的事件',
    'zh-TW': '獲取日期範圍內的事件'
  })
  .input({
    query: z.object({
      start: z.string(),
      end: z.string()
    })
  })
  .callback(({ pb, query: { start, end } }) => getEvents({ pb, start, end }))

const getToday = forgeController
  .query()
  .description({
    en: "Get today's events",
    ms: 'Dapatkan acara hari ini',
    'zh-CN': '获取今天的事件',
    'zh-TW': '獲取今天的事件'
  })
  .input({})
  .callback(async ({ pb }) => {
    const day = moment().format('YYYY-MM-DD')

    const startMoment = moment(day).startOf('day').format('YYYY-MM-DD HH:mm:ss')

    const endMoment = moment(day).endOf('day').format('YYYY-MM-DD HH:mm:ss')

    return await getEvents({ pb, start: startMoment, end: endMoment })
  })

const getById = forgeController
  .query()
  .description({
    en: 'Get a specific event by ID',
    ms: 'Dapatkan acara tertentu mengikut ID',
    'zh-CN': '根据 ID 获取特定事件',
    'zh-TW': '根據 ID 獲取特定事件'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'calendar__events'
  })
  .callback(({ pb, query: { id } }) =>
    pb.getOne.collection('calendar__events').id(id).execute()
  )

const create = forgeController
  .mutation()
  .description({
    en: 'Create a new event',
    ms: 'Cipta acara baharu',
    'zh-CN': '创建新事件',
    'zh-TW': '創建新事件'
  })
  .input({
    body: CreateAndUpdateEventSchema
  })
  .statusCode(201)
  .existenceCheck('body', {
    calendar: '[calendar__calendars]',
    category: 'calendar__categories'
  })
  .callback(async ({ pb, body }) => {
    const eventData = body as z.infer<typeof CreateAndUpdateEventSchema>

    const baseEvent = await pb.create
      .collection('calendar__events')
      .data({
        title: eventData.title,
        category: eventData.category,
        calendar: eventData.calendar,
        location: eventData.location?.name || '',
        location_coords: {
          lat: eventData.location?.location.latitude || 0,
          lon: eventData.location?.location.longitude || 0
        },
        reference_link: eventData.reference_link || '',
        description: eventData.description || '',
        type: eventData.type
      })
      .execute()

    if (eventData.type === 'recurring') {
      const duration = eventData.rrule.split('||').pop()

      if (!duration) {
        throw new ClientError('Invalid duration format')
      }

      const matched = /duration_amt=(\d+);duration_unit=(\w+)/.exec(duration)!

      if (!matched || matched.length < 3) {
        throw new ClientError('Invalid duration format')
      }

      const amount = matched[1]

      const unit = matched[2]

      if (
        Number.isNaN(Number(amount)) ||
        !['hour', 'day', 'week', 'month', 'year'].includes(unit)
      ) {
        throw new ClientError('Invalid duration format')
      }

      await pb.create
        .collection('calendar__events_recurring')
        .data({
          base_event: baseEvent.id,
          recurring_rule: eventData.rrule.split('||')[0],
          duration_amount: parseInt(amount),
          duration_unit: unit || 'day',
          exceptions: []
        })
        .execute()
    } else {
      if (!('start' in eventData) || !('end' in eventData)) {
        throw new Error('Single events must have start and end times')
      }

      await pb.create
        .collection('calendar__events_single')
        .data({
          base_event: baseEvent.id,
          start: eventData.start,
          end: eventData.end
        })
        .execute()
    }
  })

const scanImage = forgeController
  .mutation()
  .description({
    en: 'Extract event details from image using AI',
    ms: 'Ekstrak butiran acara dari gambar menggunakan AI',
    'zh-CN': '使用 AI 从图片中提取事件详情',
    'zh-TW': '使用 AI 從圖片中提取事件詳情'
  })
  .input({})
  .media({
    file: {
      optional: false,
      multiple: false
    }
  })
  .callback(async ({ pb, media: { file } }) => {
    if (!file || typeof file === 'string') {
      throw new ClientError('No file uploaded')
    }

    const gcloudKey = await getAPIKey('gcloud', pb)

    const categories = await pb.getFullList
      .collection('calendar__categories')
      .execute()

    const categoryList = categories.map(category => category.name)

    const responseStructure = z.object({
      title: z.string(),
      start: z.string(),
      end: z.string(),
      location: z.string().nullable(),
      description: z.string().nullable(),
      category: z.string().nullable()
    })

    const base64Image = fs.readFileSync(file.path, {
      encoding: 'base64'
    })

    const response = await fetchAI({
      pb,
      provider: 'openai',
      model: 'gpt-4o',
      structure: responseStructure,
      messages: [
        {
          role: 'system',
          content: `You are a calendar assistant. Extract the event details from the image. If no event can be extracted, respond with null. Assume that today is ${moment().format(
            'YYYY-MM-DD'
          )} unless specified otherwise. 

          The title should be the name of the event.

          The dates should be in the format of YYYY-MM-DD HH:mm:ss
          
          Parse the description (event details) from the image and express it in the form of markdown. If there are multiple lines of description seen in the image, try not to squeeze everything into a single paragraph. If possible, break the details into multiple sections, with each section having a h3 heading. For example:

          ### Section Title:
          Section details here.

          ### Another Section Title:
          Another section details here.
          
          The categories should be one of the following (case sensitive): ${categoryList.join(
            ', '
          )}. Try to pick the most relevant category instead of just picking the most general one, unless you're really not sure`
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_image',
              image_url: `data:${file.mimetype};base64,${base64Image}`,
              detail: 'auto'
            }
          ]
        }
      ]
    })

    if (!response) {
      throw new Error('Failed to scan image')
    }

    const finalResponse = {
      title: response.title,
      start: response.start,
      end: response.end,
      location: response.location || '',
      location_coords: { lat: 0, lon: 0 },
      description: response.description || '',
      category:
        categories.find(category => category.name === response.category)?.id ||
        ''
    }

    if (finalResponse.location && gcloudKey) {
      const locationInGoogleMap = await searchLocations(
        gcloudKey,
        finalResponse.location
      )

      if (locationInGoogleMap.length > 0) {
        finalResponse.location = locationInGoogleMap[0].name
        finalResponse.location_coords = {
          lat: locationInGoogleMap[0].location.latitude,
          lon: locationInGoogleMap[0].location.longitude
        }
      }
    }

    return finalResponse
  })

const addException = forgeController
  .mutation()
  .description({
    en: 'Add exception date to recurring event',
    ms: 'Tambah tarikh pengecualian ke acara berulang',
    'zh-CN': '为周期事件添加异常日期',
    'zh-TW': '為周期事件添加異常日期'
  })
  .input({
    query: z.object({
      id: z.string(),
      date: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'calendar__events'
  })
  .callback(async ({ pb, query: { id, date } }) => {
    const eventList = await pb.getFullList
      .collection('calendar__events_recurring')
      .filter([{ field: 'base_event', operator: '=', value: id }])
      .execute()

    const event = eventList[0]

    const exceptions = event.exceptions || []

    if (exceptions.includes(date)) {
      return false
    }

    exceptions.push(date)

    await pb.update
      .collection('calendar__events_recurring')
      .id(event.id)
      .data({ exceptions })
      .execute()

    return true
  })

const update = forgeController
  .mutation()
  .description({
    en: 'Update event details',
    ms: 'Kemas kini butiran acara',
    'zh-CN': '更新事件详情',
    'zh-TW': '更新事件詳情'
  })
  .input({
    query: z.object({
      id: z.string()
    }),
    body: CreateAndUpdateEventSchema
  })
  .existenceCheck('query', {
    id: 'calendar__events'
  })
  .existenceCheck('body', {
    calendar: '[calendar__calendars]',
    category: 'calendar__categories'
  })
  .callback(async ({ pb, query: { id }, body }) => {
    const eventData = body as z.infer<typeof CreateAndUpdateEventSchema>

    const location = eventData.location

    const toBeUpdatedData = {
      ...eventData,
      ...(typeof location === 'object'
        ? {
            location: location.name,
            location_coords: {
              lat: location.location.latitude,
              lon: location.location.longitude
            }
          }
        : { location: undefined })
    }

    await pb.update
      .collection('calendar__events')
      .id(id)
      .data(toBeUpdatedData)
      .execute()

    if (eventData.type === 'recurring') {
      const duration = eventData.rrule.split('||').pop()

      if (!duration) {
        throw new ClientError('Invalid duration format')
      }

      const matched = /duration_amt=(\d+);duration_unit=(\w+)/.exec(duration)!

      if (!matched || matched.length < 3) {
        throw new ClientError('Invalid duration format')
      }

      const amount = matched[1]

      const unit = matched[2]

      if (
        Number.isNaN(Number(amount)) ||
        !['hour', 'day', 'week', 'month', 'year'].includes(unit)
      ) {
        throw new ClientError('Invalid duration format')
      }

      const subEvent = await pb.getFirstListItem
        .collection('calendar__events_recurring')
        .filter([
          {
            field: 'base_event',
            operator: '=',
            value: id
          }
        ])
        .execute()

      await pb.update
        .collection('calendar__events_recurring')
        .id(subEvent.id)
        .data({
          recurring_rule: eventData.rrule.split('||')[0],
          duration_amount: Number(amount),
          duration_unit: unit
        })
        .execute()
    } else {
      const subEvent = await pb.getFirstListItem
        .collection('calendar__events_single')
        .filter([
          {
            field: 'base_event',
            operator: '=',
            value: id
          }
        ])
        .execute()

      await pb.update
        .collection('calendar__events_single')
        .id(subEvent.id)
        .data({
          start: eventData.start,
          end: eventData.end
        })
        .execute()
    }
  })

const remove = forgeController
  .mutation()
  .description({
    en: 'Delete an event',
    ms: 'Padam acara',
    'zh-CN': '删除事件',
    'zh-TW': '刪除事件'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'calendar__events'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('calendar__events').id(id).execute()
  )

export default forgeRouter({
  getByDateRange,
  getToday,
  getById,
  create,
  addException,
  update,
  remove,
  scanImage
})
