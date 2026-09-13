import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import fs from 'fs'
import path from 'path'

import { ICalSyncService } from './icalSyncing'

dayjs.extend(utc)

export default async function getEvents({
  pb,
  start,
  end,
  logging
}: {
  pb: any
  start: string
  end: string
  logging: any
}) {
  const calendarsWithIcs = await pb.getFullList
    .collection('calendars')
    .filter([{ field: 'link', operator: '!=', value: '' }])
    .execute()

  const syncService = new ICalSyncService(pb)

  for (const calendar of calendarsWithIcs) {
    if (await syncService.shouldSync(calendar.id)) {
      // Sync in background (don't await to avoid blocking)
      syncService.syncCalendar(calendar.id, calendar.link).catch(console.error)
    }
  }

  const startMoment = dayjs(start).startOf('day').format('YYYY-MM-DD HH:mm:ss')

  const endMoment = dayjs(end).endOf('day').format('YYYY-MM-DD HH:mm:ss')

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
  const singleCalendarEvents = (await pb.getFullList
    .collection('events_single')
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
    .expand({ base_event: 'events' })
    .execute()) as any[]

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
    .collection('events_recurring')
    .expand({ base_event: 'events' })
    .execute()

  const { RRule } = await import('rrule')

  for (const event of recurringCalendarEvents) {
    const baseEvent = event.expand!.base_event!

    const parsed = RRule.fromString(event.recurring_rule)

    const eventsInRange = parsed.between(
      dayjs(startMoment)
        .subtract(event.duration_amount, event.duration_unit)
        .toDate(),
      dayjs(endMoment).toDate(),
      true
    )

    for (const eventDate of eventsInRange) {
      const eventStart = dayjs(eventDate).utc().format('YYYY-MM-DD HH:mm:ss')

      if (
        event.exceptions?.some(
          (exception: string) =>
            dayjs(exception).format('YYYY-MM-DD HH:mm:ss') === eventStart
        )
      ) {
        continue
      }

      const eventEnd = dayjs(eventDate)
        .add(event.duration_amount, event.duration_unit)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss')

      allEvents.push({
        id: `${baseEvent.id}-${dayjs(eventDate).format('YYYYMMDD_HH:mm:ss')}`,
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

  const icalEvents = (await pb.getFullList
    .collection('events_ical')
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
    .expand({ calendar: 'calendars' })
    .execute()) as any[]

  // Convert iCal events to your format
  const formattedIcalEvents = icalEvents.map(event => ({
    id: `ical-${event.id}`,
    type: 'single' as const,
    start: event.start,
    end: event.end,
    title: event.title,
    calendar: event.expand!.calendar!.id,
    category: '_external',
    description: event.description,
    location: event.location,
    location_coords: { lat: 0, lon: 0 },
    reference_link: ''
  }))

  allEvents.push(...formattedIcalEvents)

  const externalEventGetterFiles = fs.globSync(
    '../../modules/*/server/events.ts'
  )

  logging.debug(
    `Found ${externalEventGetterFiles.length} external event getter files`
  )

  for (const file of externalEventGetterFiles) {
    try {
      const { default: getEvents } = await import(path.resolve(file))

      const entries = await getEvents({
        pb,
        start: startMoment,
        end: endMoment
      })

      allEvents.push(...entries)
    } catch (err) {
      logging.warn(`Cannot import external events from ${file}: ${err}`)
    }
  }

  return allEvents
}
