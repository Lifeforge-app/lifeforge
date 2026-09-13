import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import fs from 'fs'
import z from 'zod'

import { LocationSchema } from '@lifeforge/server-utils'

import forge from '../forge'
import getEvents from '../functions/getEvents'
import calendarSchemas from '../schema'

dayjs.extend(utc)

const CreateAndUpdateEventSchema = calendarSchemas.events
  .omit({
    type: true,
    location: true,
    location_coords: true,
    created: true,
    updated: true,
    calendar: true,
    id: true,
    collectionId: true,
    collectionName: true
  })
  .extend({
    calendar: z.string().optional(),
    location: LocationSchema.optional()
  })
  .and(
    z.union([
      z
        .object({
          type: z.literal('single')
        })
        .and(
          calendarSchemas.events_single.omit({
            base_event: true,
            id: true,
            collectionId: true,
            collectionName: true
          })
        ),
      z.object({
        type: z.literal('recurring'),
        rrule: z.string()
      })
    ])
  )

export const getByDateRange = forge
  .query({
    description: 'Get events within a date range',
    input: {
      query: z.object({
        start: z.string(),
        end: z.string()
      })
    },
    output: {
      OK: z.array(
        z.object({
          id: z.string(),
          type: z.enum(['single', 'recurring']),
          start: z.string(),
          end: z.string(),
          rrule: z.string().optional(),
          title: z.string(),
          calendar: z.string(),
          category: z.string(),
          description: z.string(),
          location: z.string(),
          location_coords: z.object({
            lat: z.number(),
            lon: z.number()
          }),
          reference_link: z.string(),
          is_strikethrough: z.boolean().optional()
        })
      )
    }
  })
  .callback(
    async ({ pb, query: { start, end }, core: { logging }, response }) =>
      response.ok(await getEvents({ pb, start, end, logging }))
  )

export const getToday = forge
  .query({
    description: "Get today's events",
    output: {
      OK: z.array(
        calendarSchemas.events
          .omit({
            created: true,
            updated: true,
            collectionId: true,
            collectionName: true
          })
          .extend({
            start: z.string(),
            end: z.string()
          })
      )
    }
  })
  .callback(async ({ pb, core: { logging }, response }) => {
    const day = dayjs().format('YYYY-MM-DD')

    const startMoment = dayjs(day).startOf('day').format('YYYY-MM-DD HH:mm:ss')

    const endMoment = dayjs(day).endOf('day').format('YYYY-MM-DD HH:mm:ss')

    return response.ok(
      await getEvents({ pb, start: startMoment, end: endMoment, logging })
    )
  })

export const getById = forge
  .query({
    description: 'Get a specific event by ID',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'events' }
    },
    output: {
      OK: calendarSchemas.events,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) =>
    response.ok(await pb.getOne.collection('events').id(id).execute())
  )

export const create = forge
  .mutation({
    description: 'Create a new event',
    input: {
      body: CreateAndUpdateEventSchema
    },
    existenceCheck: {
      body: { calendar: '[calendars]', category: 'categories' }
    },
    output: {
      CREATED: calendarSchemas.events,
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, body, response }) => {
    const eventData = body as z.infer<typeof CreateAndUpdateEventSchema>

    const baseEvent = await pb.create
      .collection('events')
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
        return response.badRequest('Invalid duration format')
      }

      const matched = /duration_amt=(\d+);duration_unit=(\w+)/.exec(duration)!

      if (!matched || matched.length < 3) {
        return response.badRequest('Invalid duration format')
      }

      const amount = matched[1]

      const unit = matched[2]

      if (
        Number.isNaN(Number(amount)) ||
        !['hour', 'day', 'week', 'month', 'year'].includes(unit)
      ) {
        return response.badRequest('Invalid duration format')
      }

      await pb.create
        .collection('events_recurring')
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
        return response.badRequest(
          'Single events must have start and end times'
        )
      }

      await pb.create
        .collection('events_single')
        .data({
          base_event: baseEvent.id,
          start: dayjs(eventData.start).utc().format('YYYY-MM-DD HH:mm:ss'),
          end: dayjs(eventData.end).utc().format('YYYY-MM-DD HH:mm:ss')
        })
        .execute()
    }

    return response.created(baseEvent)
  })

export const scanImage = forge
  .mutation({
    description: 'Extract event details from image using AI',
    media: {
      file: {
        optional: false,
        multiple: false
      }
    },
    output: {
      OK: z.object({
        title: z.string(),
        start: z.string(),
        end: z.string(),
        location: z.string(),
        location_coords: z.object({ lat: z.number(), lon: z.number() }),
        description: z.string(),
        category: z.string()
      }),
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({
      pb,
      media: { file },
      core: {
        api: { fetchAI, getAPIKey, searchLocations }
      },
      response
    }) => {
      if (!file || typeof file === 'string') {
        return response.badRequest('No file uploaded')
      }

      const gcloudKey = await getAPIKey('gcloud', pb)

      const categories = await pb.getFullList.collection('categories').execute()

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

      const aiResponse = await fetchAI({
        pb,
        provider: 'openai',
        model: 'gpt-5.4-mini',
        structure: responseStructure,
        messages: [
          {
            role: 'system',
            content: `You are a calendar assistant. Extract the event details from the image. If no event can be extracted, respond with null. Assume that today is ${dayjs().format(
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
        ] as any
      })

      if (!aiResponse) {
        return response.badRequest('Failed to scan image')
      }

      const finalResponse = {
        title: aiResponse.title,
        start: aiResponse.start,
        end: aiResponse.end,
        location: aiResponse.location || '',
        location_coords: { lat: 0, lon: 0 },
        description: aiResponse.description || '',
        category:
          categories.find(category => category.name === aiResponse.category)
            ?.id || ''
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

      return response.ok(finalResponse)
    }
  )

export const addException = forge
  .mutation({
    description: 'Add exception date to recurring event',
    input: {
      query: z.object({
        id: z.string(),
        date: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'events' }
    },
    output: {
      OK: z.boolean(),
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id, date }, response }) => {
    const eventList = await pb.getFullList
      .collection('events_recurring')
      .filter([{ field: 'base_event', operator: '=', value: id }])
      .execute()

    const event = eventList[0]

    const exceptions = event.exceptions || []

    if (exceptions.includes(date)) {
      return response.ok(false)
    }

    exceptions.push(date)

    await pb.update
      .collection('events_recurring')
      .id(event.id)
      .data({ exceptions })
      .execute()

    return response.ok(true)
  })

export const update = forge
  .mutation({
    description: 'Update event details',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: CreateAndUpdateEventSchema
    },
    existenceCheck: {
      query: { id: 'events' },
      body: { calendar: '[calendars]', category: 'categories' }
    },
    output: {
      OK: calendarSchemas.events,
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) => {
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

    await pb.update.collection('events').id(id).data(toBeUpdatedData).execute()

    if (eventData.type === 'recurring') {
      const duration = eventData.rrule.split('||').pop()

      if (!duration) {
        return response.badRequest('Invalid duration format')
      }

      const matched = /duration_amt=(\d+);duration_unit=(\w+)/.exec(duration)!

      if (!matched || matched.length < 3) {
        return response.badRequest('Invalid duration format')
      }

      const amount = matched[1]

      const unit = matched[2]

      if (
        Number.isNaN(Number(amount)) ||
        !['hour', 'day', 'week', 'month', 'year'].includes(unit)
      ) {
        return response.badRequest('Invalid duration format')
      }

      const subEvent = await pb.getFirstListItem
        .collection('events_recurring')
        .filter([
          {
            field: 'base_event',
            operator: '=',
            value: id
          }
        ])
        .execute()

      await pb.update
        .collection('events_recurring')
        .id(subEvent.id)
        .data({
          recurring_rule: eventData.rrule.split('||')[0],
          duration_amount: Number(amount),
          duration_unit: unit
        })
        .execute()
    } else {
      const subEvent = await pb.getFirstListItem
        .collection('events_single')
        .filter([
          {
            field: 'base_event',
            operator: '=',
            value: id
          }
        ])
        .execute()

      await pb.update
        .collection('events_single')
        .id(subEvent.id)
        .data({
          start: dayjs(eventData.start).utc().format('YYYY-MM-DD HH:mm:ss'),
          end: dayjs(eventData.end).utc().format('YYYY-MM-DD HH:mm:ss')
        })
        .execute()
    }

    return response.ok(await pb.getOne.collection('events').id(id).execute())
  })

export const remove = forge
  .mutation({
    description: 'Delete an event',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'events' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('events').id(id).execute()

    return response.noContent()
  })
