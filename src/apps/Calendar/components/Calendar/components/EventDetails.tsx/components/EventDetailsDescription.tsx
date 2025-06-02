import { Icon } from '@iconify/react/dist/iconify.js'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import Markdown from 'react-markdown'
import { Link } from 'react-router'

import { Button } from '@lifeforge/ui'

import { ICalendarEvent } from '@apps/Calendar/interfaces/calendar_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

function EventDetailsDescription({ event }: { event: ICalendarEvent }) {
  const calendarsQuery = useAPIQuery<ICalendarEvent[]>('calendar/calendars', [
    'calendar',
    'calendars'
  ])
  const eventIsWholeDay = useMemo(() => {
    return (
      dayjs(event.start).format('HH:mm') === '00:00' &&
      dayjs(event.end).format('HH:mm') === '00:00' &&
      dayjs(event.end).diff(dayjs(event.start), 'day') === 1
    )
  }, [event.start, event.end])

  const eventTime = useMemo(() => {
    if (eventIsWholeDay) {
      return 'All Day'
    }

    return dayjs(event.end).diff(dayjs(event.start), 'day') > 1
      ? `${dayjs(event.start).format('YYYY-MM-DD h:mm A')} - ${dayjs(event.end).format('YYYY-MM-DD h:mm A')}`
      : `${dayjs(event.start).format('h:mm A')} - ${dayjs(event.end).format('h:mm A')}`
  }, [event.start, event.end, eventIsWholeDay])

  const eventCalendar = useMemo(() => {
    return calendarsQuery.data?.find(calendar => calendar.id === event.calendar)
  }, [calendarsQuery.data, event.calendar])

  return (
    <>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-3">
          <Icon
            className="text-bg-500 size-4 shrink-0"
            icon="tabler:clock-hour-3"
          />
          <span className="text-bg-500">{eventTime}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-3">
            <Icon
              className="text-bg-500 size-4 shrink-0"
              icon="tabler:map-pin"
            />
            <span className="text-bg-500">{event.location}</span>
          </div>
        )}
        {eventCalendar && (
          <div className="flex items-center gap-3">
            <Icon
              className="text-bg-500 size-4 shrink-0"
              icon={eventCalendar.icon ?? 'tabler:calendar'}
            />
            <div className="flex items-center gap-2">
              <span
                className="block h-4 w-1 rounded-md"
                style={{ backgroundColor: eventCalendar.color }}
              />
              <span className="text-bg-500">{eventCalendar.name}</span>
            </div>
          </div>
        )}
        {event.description && (
          <div className="prose max-w-auto! mt-8 w-full">
            <Markdown>{event.description}</Markdown>
          </div>
        )}
      </div>
      {event.reference_link && (
        <Button
          as={Link}
          className="mt-6 w-full"
          icon="tabler:link"
          rel="noopener noreferrer"
          target={
            event.reference_link.startsWith('http') ? '_blank' : undefined
          }
          to={event.reference_link}
          variant="secondary"
        >
          View Reference
        </Button>
      )}
    </>
  )
}

export default EventDetailsDescription
