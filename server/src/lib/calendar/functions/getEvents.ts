import { PBService } from '@functions/database'
import moment from 'moment'
import rrule from 'rrule'

export default async function getEvents({
  pb,
  start,
  end
}: {
  pb: PBService
  start: string
  end: string
}) {
  const startMoment = moment(start).startOf('day').format('YYYY-MM-DD HH:mm:ss')

  const endMoment = moment(end).endOf('day').format('YYYY-MM-DD HH:mm:ss')

  const allEvents: Array<{
    id: string
    type: 'single' | 'recurring'
    start: string
    end: string
    rrule?: string
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
        .subtract(event.duration_amount, event.duration_unit)
        .toDate(),
      moment(endMoment).toDate(),
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
        id: `${baseEvent.id}-${moment(eventDate).format('YYYYMMDD_HH:mm:ss')}`,
        type: 'recurring',
        start: eventStart,
        end: eventEnd,
        rrule: `${event.recurring_rule}||duration_amt=${event.duration_amount};duration_unit=${event.duration_unit}`,
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
![${entry.title}](http://image.tmdb.org/t/p/w300/${entry.poster})

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
}
