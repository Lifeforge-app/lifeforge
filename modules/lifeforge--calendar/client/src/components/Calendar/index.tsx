import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useMemo } from 'react'
import {
  Calendar,
  type Components,
  type View,
  dayjsLocalizer
} from 'react-big-calendar'
import type withDragAndDropType from 'react-big-calendar/lib/addons/dragAndDrop'
import dragAndDropModule, {
  type EventInteractionArgs
} from 'react-big-calendar/lib/addons/dragAndDrop'

import type { InferOutput } from '@lifeforge/api'
import { useModalStore } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'
import { forgeAPI } from '@/manifest'

import ModifyEventModal from '../modals/ModifyEventModal'
import AgendaDate from './components/AgendaView/AgendaDate'
import AgendaEventItem from './components/AgendaView/AgendaEventItem'
import EventItem from './components/EventItem'
import CalendarHeader from './components/Headers/CalendarHeader'
import WeekHeader from './components/Headers/WeekHeader'

export type CalendarEvent = InferOutput<
  typeof forgeAPI.events.getByDateRange
>[number]

export type CalendarCategory = InferOutput<
  typeof forgeAPI.categories.list
>[number]

export type CalendarCalendar = InferOutput<
  typeof forgeAPI.calendars.list
>[number]

const localizer = dayjsLocalizer(dayjs)

const dragAndDropModuleUnknown = dragAndDropModule as unknown as {
  default?: {
    default?: unknown
  }
}

const withDragAndDrop = (dragAndDropModuleUnknown.default?.default ||
  dragAndDropModuleUnknown.default ||
  dragAndDropModule) as typeof withDragAndDropType

const DnDCalendar = withDragAndDrop(Calendar)

interface CalendarComponentProps {
  events: CalendarEvent[]
  selectedCategory: string | undefined
  selectedCalendar: string | undefined
}

function CalendarComponent({
  events: rawEvents,
  selectedCategory,
  selectedCalendar
}: CalendarComponentProps) {
  const events = useMemo(() => {
    if (rawEvents) {
      return rawEvents.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }))
    } else {
      return []
    }
  }, [rawEvents])

  const { open } = useModalStore()
  const queryClient = useQueryClient()
  const { start, end, view, date, updateFilter } = useFilter()
  const calendarDate = useMemo(() => dayjs(date).toDate(), [date])

  const handleNavigate = useCallback(
    (newDate: Date) => {
      updateFilter('date', dayjs(newDate).format('YYYY-MM-DD'))
    },
    [updateFilter]
  )
  const handleView = useCallback(
    (newView: View) => {
      updateFilter('view', newView)
    },
    [updateFilter]
  )

  const filteredEvents = useMemo(
    () =>
      events.filter(
        event =>
          (selectedCalendar ? event.calendar === selectedCalendar : true) &&
          (selectedCategory ? event.category === selectedCategory : true)
      ),
    [events, selectedCategory, selectedCalendar]
  )

  const handleDateRangeChange = useCallback(
    (
      range:
        | Date[]
        | {
            start: Date
            end: Date
          }
    ) => {
      if (Array.isArray(range)) {
        const startVal = dayjs(range[0]).format('YYYY-MM-DD')
        const endVal = dayjs(range[range.length - 1]).format('YYYY-MM-DD')
        updateFilter({ start: startVal, end: endVal })

        return
      }

      if (range.start && range.end) {
        const startVal = dayjs(range.start).format('YYYY-MM-DD')
        const endVal = dayjs(range.end).format('YYYY-MM-DD')
        updateFilter({ start: startVal, end: endVal })
      }
    },
    [updateFilter]
  )

  const calendarComponents = useMemo(
    (): Components => ({
      toolbar: (props: any) => {
        return <CalendarHeader {...props} />
      },
      event: ({ event }: { event: object }) => {
        return <EventItem event={event as CalendarEvent} />
      },
      week: {
        header: WeekHeader
      },
      agenda: {
        date: AgendaDate as (props: unknown) => React.ReactElement,
        event: ({ event }: { event: object }) => (
          <AgendaEventItem event={event as CalendarEvent} />
        )
      }
    }),
    []
  )

  const updateEvent = useCallback(
    async ({ event, start, end }: EventInteractionArgs<CalendarEvent>) => {
      queryClient.setQueryData(
        forgeAPI.events.getByDateRange.input({
          start: start as string,
          end: end as string
        }).key,
        (prevEvents: CalendarEvent[]) => {
          return prevEvents.map(prevEvent => {
            if (prevEvent.id === event.id) {
              return {
                ...prevEvent,
                start,
                end
              }
            }

            return prevEvent
          })
        }
      )

      await forgeAPI.events.update
        .input({
          id: event.id
        })
        .mutate({
          ...(event as any),
          start: dayjs(start).toISOString(),
          end: dayjs(end).toISOString()
        })
    },
    [queryClient, start, end]
  )

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      open(ModifyEventModal, {
        type: 'create',
        initialData: {
          type: 'single',
          start: dayjs(start).format('YYYY-MM-DD HH:mm:ss'),
          end: dayjs(end).subtract(1, 'minute').format('YYYY-MM-DD HH:mm:ss')
        }
      })
    },
    []
  )

  const handleEventChange = useCallback((e: EventInteractionArgs<object>) => {
    updateEvent(e as EventInteractionArgs<CalendarEvent>).catch(console.error)
  }, [])

  const draggableAccessor = useCallback((event: CalendarEvent) => {
    return !(event.category.startsWith('_') || event.type === 'recurring')
  }, [])

  return (
    <DnDCalendar
      selectable
      components={calendarComponents}
      date={calendarDate}
      draggableAccessor={draggableAccessor as (event: object) => boolean}
      events={filteredEvents}
      localizer={localizer}
      view={view}
      onEventDrop={handleEventChange}
      onEventResize={handleEventChange}
      onNavigate={handleNavigate}
      onRangeChange={handleDateRangeChange}
      onSelectSlot={handleSelectSlot}
      onView={handleView}
    />
  )
}

export default CalendarComponent
