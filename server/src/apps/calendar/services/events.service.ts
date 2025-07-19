import { fetchAI } from '@functions/fetchAI'
import fs from 'fs'
import moment from 'moment'
import PocketBase from 'pocketbase'
import { z } from 'zod'

import { ISchemaWithPB } from 'shared/types/collections'
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

  const allEvents: ISchemaWithPB<CalendarCollectionsSchemas.IEvent>[] = []

  const singleCalendarEvents = await pb
    .collection('calendar__events_single')
    .getFullList<
      ISchemaWithPB<CalendarCollectionsSchemas.IEventsSingle> & {
        expand: ISchemaWithPB<CalendarCollectionsSchemas.IEvent>[]
      }
    >({
      filter: `(start >= '${start}' || end >= '${start}') && (start <= '${end}' || end <= '${end}')`,
      expand: 'calendar__events'
    })

  console.log(singleCalendarEvents)

  allEvents.push(...singleCalendarEvents.map(event => ({})))

  return []

  //   const recurringCalendarEvents = await pb
  //     .collection('calendar__events')
  //     .getFullList<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>>({
  //       filter: "type='recurring'"
  //     })

  //   for (const event of recurringCalendarEvents) {
  //     if (event.type !== 'recurring') continue

  //     const parsed = rrule.RRule.fromString(event.recurring_rrule)

  //     const eventsInRange = parsed.between(
  //       moment(start)
  //         .subtract(
  //           event.recurring_duration_amount + 1,
  //           event.recurring_duration_unit
  //         )
  //         .toDate(),
  //       moment(end)
  //         .add(event.recurring_duration_amount + 1, event.recurring_duration_unit)
  //         .toDate(),
  //       true
  //     )

  //     for (const eventDate of eventsInRange) {
  //       const start = moment(eventDate).utc().format('YYYY-MM-DD HH:mm:ss')

  //       if (
  //         event.exceptions?.some(
  //           (exception: string[]) =>
  //             moment(exception).format('YYYY-MM-DD HH:mm:ss') === start
  //         )
  //       ) {
  //         continue
  //       }

  //       const end = moment(eventDate)
  //         .add(event.recurring_duration_amount, event.recurring_duration_unit)
  //         .utc()
  //         .format('YYYY-MM-DD HH:mm:ss')

  //       allEvents.push({
  //         id: `${event.id}-${moment(eventDate).format('YYYYMMDD')}`,
  //         start,
  //         end,
  //         title: event.title,
  //         calendar: event.calendar,
  //         category: event.category,
  //         description: event.description,
  //         location: event.location,
  //         reference_link: event.reference_link
  //       })
  //     }
  //   }

  //   const todoEntries = (
  //     await pb
  //       .collection('todo_list__entries')
  //       .getFullList<ISchemaWithPB<TodoListCollectionsSchemas.IEntry>>({
  //         filter: `due_date >= '${start}' && due_date <= '${end}'`
  //       })
  //       .catch(() => [])
  //   ).map(entry => {
  //     return {
  //       id: entry.id,
  //       title: entry.summary,
  //       start: entry.due_date,
  //       end: moment(entry.due_date).add(1, 'millisecond').toISOString(),
  //       category: '_todo',
  //       description: entry.notes,
  //       location: '',
  //       reference_link: `/todo-list?entry=${entry.id}`
  //     } satisfies Partial<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>>
  //   })

  //   allEvents.push(...todoEntries)

  //   const movieEntries = (
  //     await pb
  //       .collection('movies__entries')
  //       .getFullList<ISchemaWithPB<MoviesCollectionsSchemas.IEntry>>({
  //         filter: `theatre_showtime >= '${start}' && theatre_showtime <= '${end}'`
  //       })
  //       .catch(() => [])
  //   ).map(entry => {
  //     return {
  //       id: entry.id,
  //       title: entry.title,
  //       start: entry.theatre_showtime,
  //       end: moment(entry.theatre_showtime)
  //         .add(entry.duration, 'minutes')
  //         .toISOString(),
  //       category: '_movie',
  //       location: entry.theatre_location ?? '',
  //       description: `
  // ### Movie Description:
  // ${entry.overview}

  // ### Theatre Number:
  // ${entry.theatre_number}

  // ### Seat Number:
  // ${entry.theatre_seat}
  //       `,
  //       reference_link: `/movies?show-ticket=${entry.id}`
  //     } satisfies Partial<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>>
  //   })

  //   allEvents.push(...movieEntries)

  //   return allEvents
  // }

  // export const getTodayEvents = async (
  //   pb: PocketBase
  // ): Promise<ISchemaWithPB<Partial<CalendarCollectionsSchemas.IEvent>>[]> => {
  //   const day = moment().format('YYYY-MM-DD')

  //   const events = await getEventsByDateRange(pb, day, day)

  //   return events
}

export const createEvent = async (
  pb: PocketBase,
  eventData: Omit<
    CalendarCollectionsSchemas.IEvent,
    'is_strikethrough' | 'exceptions' | 'location'
  > & {
    location?: string | { displayName: { text: string } }
  }
): Promise<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>> => {
  if (eventData.type === 'recurring') {
    eventData.end = ''
  } else {
    eventData.recurring_rrule = ''
    eventData.recurring_duration_amount = 0
    eventData.recurring_duration_unit = ''
  }

  if (typeof eventData.location === 'object') {
    eventData.location = (eventData.location as any).displayName.text || ''
  }

  return await pb
    .collection('calendar__events')
    .create<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>>(eventData)
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

export const updateEvent = (
  pb: PocketBase,
  id: string,
  eventData: Omit<
    Partial<CalendarCollectionsSchemas.IEvent>,
    'is_strikethrough' | 'exceptions'
  >
): Promise<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>> =>
  pb
    .collection('calendar__events')
    .update<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>>(id, eventData)

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
    .collection('calendar__events')
    .getOne<ISchemaWithPB<CalendarCollectionsSchemas.IEvent>>(id)

  const exceptions = event.exceptions || []

  if (exceptions.includes(exceptionDate)) {
    return false
  }

  exceptions.push(exceptionDate)

  await pb
    .collection('calendar__events')
    .update<
      ISchemaWithPB<CalendarCollectionsSchemas.IEvent>
    >(id, { exceptions })

  return true
}
