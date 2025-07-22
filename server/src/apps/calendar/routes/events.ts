import ClientError from '@functions/ClientError'
import { fetchAI } from '@functions/fetchAI'
import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { getAPIKey } from '@functions/getAPIKey'
import { singleUploadMiddleware } from '@middlewares/uploadMiddleware'
import fs from 'fs'
import moment from 'moment'
import rrule from 'rrule'
import { z as zOld } from 'zod'
import { z } from 'zod/v4'

import {
  CalendarCollectionsSchemas,
  ISchemaWithPB,
  LocationsCustomSchemas,
  MoviesCollectionsSchemas,
  TodoListCollectionsSchemas
} from 'shared/types/collections'

import { searchLocations } from '../../../core/lib/locations/services/locations.service'

// Define the input schemas directly in the controller
const CreateEventSchema = CalendarCollectionsSchemas.Event.omit({
  type: true,
  location: true,
  location_coords: true
})
  .extend({
    location: LocationsCustomSchemas.Location.optional()
  })
  .and(
    z.union([
      z
        .object({
          type: z.literal('single')
        })
        .and(
          CalendarCollectionsSchemas.EventsSingle.omit({
            base_event: true
          })
        ),
      z
        .object({
          type: z.literal('recurring')
        })
        .and(
          CalendarCollectionsSchemas.EventsRecurring.omit({
            base_event: true
          })
        )
    ])
  )

const UpdateEventSchema = CalendarCollectionsSchemas.Event.omit({
  type: true,
  location: true,
  location_coords: true
}).extend({
  location: LocationsCustomSchemas.Location.optional()
})

const getEventsByDateRange = forgeController
  .route('GET /')
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
    const singleCalendarEvents = await pb
      .collection('calendar__events_single')
      .getFullList<
        ISchemaWithPB<CalendarCollectionsSchemas.IEventsSingle> & {
          expand: {
            base_event: ISchemaWithPB<CalendarCollectionsSchemas.IEvent>
          }
        }
      >({
        filter: `(start >= '${startMoment}' || end >= '${startMoment}') && (start <= '${endMoment}' || end <= '${endMoment}')`,
        expand: 'base_event'
      })

    singleCalendarEvents.forEach(event => {
      const baseEvent = event.expand.base_event

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
    const recurringCalendarEvents = await pb
      .collection('calendar__events_recurring')
      .getFullList<
        ISchemaWithPB<CalendarCollectionsSchemas.IEventsRecurring> & {
          expand: {
            base_event: ISchemaWithPB<CalendarCollectionsSchemas.IEvent>
          }
        }
      >({
        expand: 'base_event'
      })

    for (const event of recurringCalendarEvents) {
      const baseEvent = event.expand.base_event

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
      await pb
        .collection('todo_list__entries')
        .getFullList<ISchemaWithPB<TodoListCollectionsSchemas.IEntry>>({
          filter: `due_date >= '${startMoment}' && due_date <= '${endMoment}'`
        })
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
      await pb
        .collection('movies__entries')
        .getFullList<ISchemaWithPB<MoviesCollectionsSchemas.IEntry>>({
          filter: `theatre_showtime >= '${startMoment}' && theatre_showtime <= '${endMoment}'`
        })
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

const getEventsToday = forgeController
  .route('GET /today')
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
    const singleCalendarEvents = await pb
      .collection('calendar__events_single')
      .getFullList<
        ISchemaWithPB<CalendarCollectionsSchemas.IEventsSingle> & {
          expand: {
            base_event: ISchemaWithPB<CalendarCollectionsSchemas.IEvent>
          }
        }
      >({
        filter: `(start >= '${startMoment}' || end >= '${startMoment}') && (start <= '${endMoment}' || end <= '${endMoment}')`,
        expand: 'base_event'
      })

    singleCalendarEvents.forEach(event => {
      const baseEvent = event.expand.base_event

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

const getEventById = forgeController
  .route('GET /:id')
  .description('Get an event by ID')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'calendar__events'
  })
  .callback(({ pb, params: { id } }) =>
    pb
      .collection('calendar__events')
      .getOne<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>>(id)
  )

const createEvent = forgeController
  .route('POST /')
  .description('Create a new event')
  .input({
    body: CreateEventSchema
  })
  .statusCode(201)
  .existenceCheck('body', {
    calendar: '[calendar__calendars]',
    category: 'calendar__categories'
  })
  .callback(async ({ pb, body }) => {
    const eventData = body as z.infer<typeof CreateEventSchema>

    const baseEvent = await pb
      .collection('calendar__events')
      .create<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>>({
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

    if (eventData.type === 'recurring') {
      if (!('recurring_rule' in eventData)) {
        throw new Error('Recurring events must have a recurring rule')
      }

      await pb
        .collection('calendar__events_recurring')
        .create<ISchemaWithPB<CalendarCollectionsSchemas.IEventsRecurring>>({
          base_event: baseEvent.id,
          recurring_rule: eventData.recurring_rule,
          duration_amount: eventData.duration_amount || 1,
          duration_unit: eventData.duration_unit || 'day',
          exceptions: eventData.exceptions || []
        })
    } else {
      if (!('start' in eventData) || !('end' in eventData)) {
        throw new Error('Single events must have start and end times')
      }

      await pb
        .collection('calendar__events_single')
        .create<ISchemaWithPB<CalendarCollectionsSchemas.IEventsSingle>>({
          base_event: baseEvent.id,
          start: eventData.start,
          end: eventData.end
        })
    }
  })

const scanImage = forgeController
  .route('POST /scan-image')
  .description('Scan an image to extract event data')
  .input({})
  .middlewares(singleUploadMiddleware)
  .callback(async ({ pb, req }) => {
    const { file } = req

    if (!file) {
      throw new ClientError('No file uploaded')
    }

    const gcloudKey = await getAPIKey('gcloud', pb)

    const categories = await pb
      .collection('calendar__categories')
      .getFullList<ISchemaWithPB<CalendarCollectionsSchemas.ICategory>>()

    const categoryList = categories.map(category => category.name)

    const responseStructure = zOld.object({
      title: zOld.string(),
      start: zOld.string(),
      end: zOld.string(),
      location: zOld.string().nullable(),
      description: zOld.string().nullable(),
      category: zOld.string().nullable()
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
        finalResponse.location,
        gcloudKey
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
  .route('DELETE /exception/:id')
  .description('Add an exception to a recurring event')
  .input({
    params: z.object({
      id: z.string()
    }),
    query: z.object({
      date: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'calendar__events'
  })
  .callback(async ({ pb, params: { id }, query: { date } }) => {
    const event = await pb
      .collection('calendar__events_recurring')
      .getFirstListItem<
        ISchemaWithPB<CalendarCollectionsSchemas.IEventsRecurring>
      >(`base_event="${id}"`)

    const exceptions = event.exceptions || []

    if (exceptions.includes(date)) {
      return false
    }

    exceptions.push(date)

    await pb
      .collection('calendar__events_recurring')
      .update<
        ISchemaWithPB<CalendarCollectionsSchemas.IEventsRecurring>
      >(event.id, { exceptions })

    return true
  })

const updateEvent = forgeController
  .route('PATCH /:id')
  .description('Update an existing event')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: UpdateEventSchema
  })
  .existenceCheck('params', {
    id: 'calendar__events'
  })
  .existenceCheck('body', {
    calendar: '[calendar__calendars]',
    category: 'calendar__categories'
  })
  .callback(async ({ pb, params: { id }, body }) => {
    const eventData = body as z.infer<typeof UpdateEventSchema>

    const location = eventData.location

    const toBeUpdatedData: Partial<CalendarCollectionsSchemas.IEvent> = {
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

    await pb
      .collection('calendar__events')
      .update<
        ISchemaWithPB<CalendarCollectionsSchemas.IEvent>
      >(id.split('-')[0], toBeUpdatedData)
  })

const deleteEvent = forgeController
  .route('DELETE /:id')
  .description('Delete an existing event')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'calendar__events'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.collection('calendar__events').delete(id)
  )

export default forgeRouter({
  getEventsByDateRange,
  getEventsToday,
  getEventById,
  createEvent,
  addException,
  updateEvent,
  deleteEvent,
  scanImage
})
