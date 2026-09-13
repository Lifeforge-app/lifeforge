// server/src/lib/calendar/services/icalSync.ts
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import ical from 'node-ical'

dayjs.extend(utc)

export class ICalSyncService {
  constructor(private pb: any) {}

  async syncCalendar(calendarId: string, icsUrl: string) {
    // Fetch iCal data
    const response = await fetch(icsUrl)

    if (!response.ok) throw new Error('Failed to fetch iCal')

    const icalData = await response.text()

    const events = ical.sync.parseICS(icalData)

    // Clear existing events for this calendar
    const existed = await this.pb.getFullList
      .collection('events_ical')
      .filter([{ field: 'calendar', operator: '=', value: calendarId }])
      .execute()

    for (const event of existed) {
      await this.pb.delete.collection('events_ical').id(event.id).execute()
    }

    // Process and save new events
    const processedEvents = []

    for (const [key, event] of Object.entries(events)) {
      if (event.type === 'VEVENT') {
        const processedEvent = {
          calendar: calendarId,
          external_id: event.uid || key,
          title:
            (event.summary as any).val || event.summary || 'Untitled Event',
          description: event.description || '',
          start: dayjs(event.start).utc().format('YYYY-MM-DD HH:mm:ss'),
          end: dayjs(event.end).utc().format('YYYY-MM-DD HH:mm:ss'),
          location: event.location || '',
          recurrence_rule: event.rrule ? event.rrule.toString() : null,
          last_modified: event.lastmodified
            ? dayjs(event.lastmodified).utc().format('YYYY-MM-DD HH:mm:ss')
            : dayjs().utc().format('YYYY-MM-DD HH:mm:ss')
        }

        await this.pb.create
          .collection('events_ical')
          .data(processedEvent)
          .execute()

        processedEvents.push(processedEvent)
      }
    }

    // Update sync status
    await this.pb.update
      .collection('calendars')
      .id(calendarId)
      .data({
        last_synced: dayjs().utc().format('YYYY-MM-DD HH:mm:ss')
      })
      .execute()

    return { success: true, eventsCount: processedEvents.length }
  }

  async shouldSync(
    calendarId: string,
    maxAge: number = 3600000
  ): Promise<boolean> {
    const syncStatus = await this.pb.getOne
      .collection('calendars')
      .id(calendarId)
      .execute()

    if (!syncStatus.last_synced) return true

    const lastSync = dayjs(syncStatus.last_synced)

    const now = dayjs()

    return now.diff(lastSync) > maxAge
  }
}
