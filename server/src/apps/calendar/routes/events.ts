import { getAPIKey } from '@functions/database'
import { fetchAI } from '@functions/external/ai'
import searchLocations from '@functions/external/location'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { singleUploadMiddleware } from '@middlewares/uploadMiddleware'
import { Location } from '@typescript/location.types'
import fs from 'fs'
import moment from 'moment'
import rrule from 'rrule'
import { z } from 'zod/v4'

import { SCHEMAS } from '../../../core/schema'

const CreateAndUpdateEventSchema = SCHEMAS.calendar.events
  .omit({
    type: true,
    location: true,
    location_coords: true,
    created: true,
    updated: true
  })
  .extend({
    location: Location.optional()
  })
  .and(
    z.union([
      z
        .object({
          type: z.literal('single')
        })
        .and(
          SCHEMAS.calendar.events_single.omit({
            base_event: true
          })
        ),
      z
        .object({
          type: z.literal('recurring')
        })
        .and(
          SCHEMAS.calendar.events_recurring.omit({
            base_event: true,
            exceptions: true
          })
        )
    ])
  )

const getByDateRange = forgeController.query
  .description('Get events by date range')
  .input({
    query: z.object({
      start: z.string(),
      end: z.string()
    })
  })
  .callback(async ({ pb, query: { start, end } }) => {
    const startMoment = moment(start).startOf('day').toISOString()

    const endMoment = moment(end).endOf('day').toISOString()

    const allEvents: Array<{
      id: string
      type: 'single' | 'recurring'
      start: string
      end: string
      title: string
      calendar: string
      category: string
      description: string
      location: string
      location_coords: { lat: number; lon: number }
      reference_link: string
      is_strikethrough?: boolean
    }> = []

    // Get single events
    const singleCalendarEvents = await pb.getFullList
      .collection('calendar__events_single')
      .filter([
        {
          combination: '||',
          filters: [
            { field: 'start', operator: '>=', value: startMoment },
            { field: 'end', operator: '>=', value: startMoment }
          ]
        },
        {
          combination: '||',
          filters: [
            { field: 'start', operator: '<=', value: endMoment },
            { field: 'end', operator: '<=', value: endMoment }
          ]
        }
      ])
      .expand({ base_event: 'calendar__events' })
      .execute()

    singleCalendarEvents.forEach(event => {
      const baseEvent = event.expand!.base_event!

      allEvents.push({
        id: baseEvent.id,
        type: 'single',
        start: event.start,
        end: event.end,
        title: baseEvent.title,
        calendar: baseEvent.calendar,
        category: baseEvent.category,
        description: baseEvent.description,
        location: baseEvent.location,
        location_coords: baseEvent.location_coords,
        reference_link: baseEvent.reference_link
      })
    })

    // Get recurring events
    const recurringCalendarEvents = await pb.getFullList
      .collection('calendar__events_recurring')
      .expand({ base_event: 'calendar__events' })
      .execute()

    for (const event of recurringCalendarEvents) {
      const baseEvent = event.expand!.base_event!

      const parsed = rrule.RRule.fromString(event.recurring_rule)

      const eventsInRange = parsed.between(
        moment(startMoment)
          .subtract(event.duration_amount + 1, event.duration_unit)
          .toDate(),
        moment(endMoment)
          .add(event.duration_amount + 1, event.duration_unit)
          .toDate(),
        true
      )

      for (const eventDate of eventsInRange) {
        const eventStart = moment(eventDate).utc().format('YYYY-MM-DD HH:mm:ss')

        if (
          event.exceptions?.some(
            (exception: string[]) =>
              moment(exception).format('YYYY-MM-DD HH:mm:ss') === eventStart
          )
        ) {
          continue
        }

        const eventEnd = moment(eventDate)
          .add(event.duration_amount, event.duration_unit)
          .utc()
          .format('YYYY-MM-DD HH:mm:ss')

        allEvents.push({
          id: `${baseEvent.id}-${moment(eventDate).format('YYYYMMDD')}`,
          type: 'recurring',
          start: eventStart,
          end: eventEnd,
          title: baseEvent.title,
          calendar: baseEvent.calendar,
          category: baseEvent.category,
          description: baseEvent.description,
          location: baseEvent.location,
          location_coords: baseEvent.location_coords,
          reference_link: baseEvent.reference_link
        })
      }
    }

    // Get todo entries
    const todoEntries = (
      await pb.getFullList
        .collection('todo_list__entries')
        .filter([
          { field: 'due_date', operator: '>=', value: startMoment },
          { field: 'due_date', operator: '<=', value: endMoment }
        ])
        .execute()
        .catch(() => [])
    ).map(entry => ({
      id: entry.id,
      type: 'single' as const,
      title: entry.summary,
      start: entry.due_date,
      end: moment(entry.due_date).add(1, 'millisecond').toISOString(),
      category: '_todo',
      calendar: '',
      description: entry.notes,
      location: '',
      location_coords: { lat: 0, lon: 0 },
      reference_link: `/todo-list?entry=${entry.id}`,
      is_strikethrough: entry.done
    }))

    allEvents.push(...todoEntries)

    // Get movie entries
    const movieEntries = (
      await pb.getFullList
        .collection('movies__entries')
        .filter([
          { field: 'theatre_showtime', operator: '>=', value: startMoment },
          { field: 'theatre_showtime', operator: '<=', value: endMoment }
        ])
        .execute()
        .catch(() => [])
    ).map(entry => ({
      id: entry.id,
      type: 'single' as const,
      title: entry.title,
      start: entry.theatre_showtime,
      end: moment(entry.theatre_showtime)
        .add(entry.duration, 'minutes')
        .toISOString(),
      category: '_movie',
      calendar: '',
      location: entry.theatre_location ?? '',
      location_coords: entry.theatre_location_coords,
      description: `
### Movie Description:
${entry.overview}

### Theatre Number:
${entry.theatre_number}

### Seat Number:
${entry.theatre_seat}
      `,
      reference_link: `/movies?show-ticket=${entry.id}`
    }))

    allEvents.push(...movieEntries)

    return allEvents
  })

const getToday = forgeController.query
  .description("Get today's events")
  .input({})
  .callback(async ({ pb }) => {
    const day = moment().format('YYYY-MM-DD')

    // Manually call the getEventsByDateRange logic
    const startMoment = moment(day).startOf('day').toISOString()

    const endMoment = moment(day).endOf('day').toISOString()

    const allEvents: Array<{
      id: string
      type: 'single' | 'recurring'
      start: string
      end: string
      title: string
      calendar: string
      category: string
      description: string
      location: string
      location_coords: { lat: number; lon: number }
      reference_link: string
      is_strikethrough?: boolean
    }> = []

    // Get single events
    const singleCalendarEvents = await pb.getFullList
      .collection('calendar__events_single')
      .filter([
        {
          combination: '||',
          filters: [
            { field: 'start', operator: '>=', value: startMoment },
            { field: 'end', operator: '>=', value: startMoment }
          ]
        },
        {
          combination: '||',
          filters: [
            { field: 'start', operator: '<=', value: endMoment },
            { field: 'end', operator: '<=', value: endMoment }
          ]
        }
      ])
      .expand({ base_event: 'calendar__events' })
      .execute()

    singleCalendarEvents.forEach(event => {
      const baseEvent = event.expand!.base_event!

      allEvents.push({
        id: baseEvent.id,
        type: 'single',
        start: event.start,
        end: event.end,
        title: baseEvent.title,
        calendar: baseEvent.calendar,
        category: baseEvent.category,
        description: baseEvent.description,
        location: baseEvent.location,
        location_coords: baseEvent.location_coords,
        reference_link: baseEvent.reference_link
      })
    })

    return allEvents
  })

const getById = forgeController.query
  .description('Get an event by ID')
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

const create = forgeController.mutation
  .description('Create a new event')
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
      if (!('recurring_rule' in eventData)) {
        throw new Error('Recurring events must have a recurring rule')
      }

      await pb.create
        .collection('calendar__events_recurring')
        .data({
          base_event: baseEvent.id,
          recurring_rule: eventData.recurring_rule,
          duration_amount: eventData.duration_amount || 1,
          duration_unit: eventData.duration_unit || 'day',
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

const scanImage = forgeController.mutation
  .description('Scan an image to extract event data')
  .input({})
  .middlewares(singleUploadMiddleware)
  .callback(async ({ pb, req }) => {
    const { file } = req

    if (!file) {
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
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
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

const addException = forgeController.mutation
  .description('Add an exception to a recurring event')
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

const update = forgeController.mutation
  .description('Update an existing event')
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
      .id(id.split('-')[0])
      .data(toBeUpdatedData)
      .execute()
  })

const remove = forgeController.mutation
  .description('Delete an existing event')
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
