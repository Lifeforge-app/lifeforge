import { fetchAI } from '@functions/fetchAI'
import fs from 'fs'
import moment from 'moment'
import PocketBase from 'pocketbase'
import rrule from 'rrule'
import { z } from 'zod'

import {
  ISchemaWithPB,
  MoviesCollectionsSchemas,
  TodoListCollectionsSchemas
} from 'shared/types/collections'
import { CalendarCollectionsSchemas } from 'shared/types/collections'
import { CalendarControllersSchemas } from 'shared/types/controllers'

export const getEventsByDateRange = async (
  pb: PocketBase,
  startDate: string,
  endDate: string
): Promise<
  CalendarControllersSchemas.IEvents['getEventsByDateRange']['response']
> => {
  const start = moment(startDate).startOf('day').toISOString()

  const end = moment(endDate).endOf('day').toISOString()

  const allEvents: (Omit<CalendarCollectionsSchemas.IEvent, 'type'> & {
    id: string
    start: string
    end: string
  })[] = []

  const singleCalendarEvents = await pb
    .collection('calendar__events_single')
    .getFullList<
      ISchemaWithPB<CalendarCollectionsSchemas.IEventsSingle> & {
        expand: {
          base_event: ISchemaWithPB<CalendarCollectionsSchemas.IEvent>
        }
      }
    >({
      filter: `(start >= '${start}' || end >= '${start}') && (start <= '${end}' || end <= '${end}')`,
      expand: 'base_event'
    })

  singleCalendarEvents.forEach(event => {
    const baseEvent = event.expand.base_event

    allEvents.push({
      id: event.id,
      start: event.start,
      end: event.end,
      title: baseEvent.title,
      calendar: baseEvent.calendar,
      category: baseEvent.category,
      description: baseEvent.description,
      location: baseEvent.location,
      use_google_map: baseEvent.use_google_map,
      reference_link: baseEvent.reference_link
    })
  })

  const recurringCalendarEvents = await pb
    .collection('calendar__events_recurring')
    .getFullList<
      ISchemaWithPB<CalendarCollectionsSchemas.IEventsRecurring> & {
        expand: {
          base_event: ISchemaWithPB<CalendarCollectionsSchemas.IEvent>
        }
      }
    >()

  for (const event of recurringCalendarEvents) {
    const baseEvent = event.expand.base_event

    const parsed = rrule.RRule.fromString(event.recurring_rule)

    const eventsInRange = parsed.between(
      moment(start)
        .subtract(event.duration_amount + 1, event.duration_unit)
        .toDate(),
      moment(end)
        .add(event.duration_amount + 1, event.duration_unit)
        .toDate(),
      true
    )

    for (const eventDate of eventsInRange) {
      const start = moment(eventDate).utc().format('YYYY-MM-DD HH:mm:ss')

      if (
        event.exceptions?.some(
          (exception: string[]) =>
            moment(exception).format('YYYY-MM-DD HH:mm:ss') === start
        )
      ) {
        continue
      }

      const end = moment(eventDate)
        .add(event.duration_amount, event.duration_unit)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss')

      allEvents.push({
        id: `${event.id}-${moment(eventDate).format('YYYYMMDD')}`,
        start,
        end,
        title: baseEvent.title,
        calendar: baseEvent.calendar,
        category: baseEvent.category,
        description: baseEvent.description,
        use_google_map: baseEvent.use_google_map,
        location: baseEvent.location,
        reference_link: baseEvent.reference_link
      })
    }
  }

  const todoEntries = (
    await pb
      .collection('todo_list__entries')
      .getFullList<ISchemaWithPB<TodoListCollectionsSchemas.IEntry>>({
        filter: `due_date >= '${start}' && due_date <= '${end}'`
      })
      .catch(() => [])
  ).map(entry => {
    return {
      id: entry.id,
      title: entry.summary,
      start: entry.due_date,
      end: moment(entry.due_date).add(1, 'millisecond').toISOString(),
      category: '_todo',
      calendar: '',
      description: entry.notes,
      use_google_map: false,
      location: '',
      reference_link: `/todo-list?entry=${entry.id}`
    } satisfies (typeof allEvents)[number]
  })

  allEvents.push(...todoEntries)

  const movieEntries = (
    await pb
      .collection('movies__entries')
      .getFullList<ISchemaWithPB<MoviesCollectionsSchemas.IEntry>>({
        filter: `theatre_showtime >= '${start}' && theatre_showtime <= '${end}'`
      })
      .catch(() => [])
  ).map(entry => {
    return {
      id: entry.id,
      title: entry.title,
      start: entry.theatre_showtime,
      end: moment(entry.theatre_showtime)
        .add(entry.duration, 'minutes')
        .toISOString(),
      category: '_movie',
      calendar: '',
      use_google_map: true,
      location: entry.theatre_location ?? '',
      description: `
  ### Movie Description:
  ${entry.overview}

  ### Theatre Number:
  ${entry.theatre_number}

  ### Seat Number:
  ${entry.theatre_seat}
        `,
      reference_link: `/movies?show-ticket=${entry.id}`
    } satisfies (typeof allEvents)[number]
  })

  allEvents.push(...movieEntries)

  return allEvents
}

export const getTodayEvents = async (
  pb: PocketBase
): Promise<
  CalendarControllersSchemas.IEvents['getEventsToday']['response']
> => {
  const day = moment().format('YYYY-MM-DD')

  const events = await getEventsByDateRange(pb, day, day)

  return events
}

export const createEvent = async (
  pb: PocketBase,
  eventData: CalendarControllersSchemas.IEvents['createEvent']['body']
): Promise<CalendarControllersSchemas.IEvents['createEvent']['response']> => {
  if (typeof eventData.location === 'object') {
    eventData.location = (eventData.location as any).displayName.text || ''
  }

  const baseEvent = await pb
    .collection('calendar__events')
    .create<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>>({
      title: eventData.title,
      category: eventData.category,
      calendar: eventData.calendar,
      use_google_map: eventData.use_google_map || false,
      location: eventData.location || '',
      reference_link: eventData.reference_link || '',
      description: eventData.description || '',
      type: eventData.type
    })

  if (eventData.type === 'recurring') {
    if (!eventData.recurring_rule) {
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
    await pb
      .collection('calendar__events_single')
      .create<ISchemaWithPB<CalendarCollectionsSchemas.IEventsSingle>>({
        base_event: baseEvent.id,
        start: eventData.start,
        end: eventData.end
      })
  }
}

export const scanImage = async (
  pb: PocketBase,
  filePath: string
): Promise<Partial<CalendarCollectionsSchemas.IEvent> | null> => {
  const categories = await pb
    .collection('calendar__categories')
    .getFullList<ISchemaWithPB<CalendarCollectionsSchemas.ICategory>>()

  const categoryList = categories.map(category => category.name)

  const responseStructure = z.object({
    title: z.string(),
    start: z.string(),
    end: z.string(),
    location: z.string().nullable(),
    description: z.string().nullable(),
    category: z.string().nullable()
  })

  const base64Image = fs.readFileSync(filePath, {
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
    return null
  }

  ;(response as Partial<CalendarCollectionsSchemas.IEvent>).category =
    categories.find(category => category.name === response.category)?.id

  return response as Partial<CalendarCollectionsSchemas.IEvent>
}

export const updateEvent = async (
  pb: PocketBase,
  id: string,
  eventData: CalendarControllersSchemas.IEvents['updateEvent']['body']
): Promise<CalendarControllersSchemas.IEvents['updateEvent']['response']> => {
  await pb
    .collection('calendar__events')
    .update<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>>(id, eventData)
}

export const deleteEvent = async (pb: PocketBase, id: string) => {
  await pb.collection('calendar__events').delete(id)
}

export const getEventById = async (
  pb: PocketBase,
  id: string
): Promise<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>> =>
  pb
    .collection('calendar__events')
    .getOne<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>>(id)

export const addException = async (
  pb: PocketBase,
  id: string,
  exceptionDate: string
): Promise<boolean> => {
  const event = await pb
    .collection('calendar__events_recurring')
    .getFirstListItem<
      ISchemaWithPB<CalendarCollectionsSchemas.IEventsRecurring>
    >(`base_event="${id}"`)

  const exceptions = event.exceptions || []

  if (exceptions.includes(exceptionDate)) {
    return false
  }

  exceptions.push(exceptionDate)

  await pb
    .collection('calendar__events_recurring')
    .update<
      ISchemaWithPB<CalendarCollectionsSchemas.IEventsRecurring>
    >(id, { exceptions })

  return true
}
