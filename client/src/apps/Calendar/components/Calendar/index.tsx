import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import withDragAndDrop, {
  EventInteractionArgs
} from 'react-big-calendar/lib/addons/dragAndDrop'

import { fetchAPI } from 'shared/lib'
import { CalendarControllersSchemas } from 'shared/types/controllers'

import { useCalendarStore } from '@apps/Calendar/stores/useCalendarStore'

import ModifyEventModal from '../modals/ModifyEventModal'
import AgendaDate from './components/AgendaView/AgendaDate'
import AgendaEventItem from './components/AgendaView/AgendaEventItem'
import EventItem from './components/EventItem'
import CalendarHeader from './components/Headers/CalendarHeader'
import WeekHeader from './components/Headers/WeekHeader'

type ICalendarEvent =
  CalendarControllersSchemas.IEvents['getEventsByDateRange']['response'][number]

const localizer = dayjsLocalizer(dayjs)

const DnDCalendar = withDragAndDrop(Calendar)

interface CalendarComponentProps {
  events: ICalendarEvent[]
  setSidebarOpen: (value: boolean) => void
  selectedCategory: string | undefined
  selectedCalendar: string | undefined
}

function CalendarComponent({
  events,
  setSidebarOpen,
  selectedCategory,
  selectedCalendar
}: CalendarComponentProps) {
  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const { eventQueryKey: queryKey, setEventQueryKey } = useCalendarStore()

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
        const start = dayjs(range[0]).format('YYYY-MM-DD')

        const end = dayjs(range[range.length - 1]).format('YYYY-MM-DD')

        setEventQueryKey(['calendar', 'events', start, end])

        return
      }

      if (range.start && range.end) {
        const start = dayjs(range.start).format('YYYY-MM-DD')

        const end = dayjs(range.end).format('YYYY-MM-DD')

        setEventQueryKey(['calendar', 'events', start, end])
      }
    },
    []
  )

  const calendarComponents = useMemo(
    () => ({
      toolbar: (props: any) => {
        return <CalendarHeader setSidebarOpen={setSidebarOpen} {...props} />
      },
      event: ({
        event
      }: {
        event:
          | CalendarControllersSchemas.IEvents['getEventById']['response']
          | Record<string, unknown>
        props: any
      }) => {
        return (
          <EventItem
            event={
              event as CalendarControllersSchemas.IEvents['getEventById']['response']
            }
          />
        )
      },
      week: {
        header: WeekHeader
      },
      agenda: {
        date: AgendaDate,
        event: ({ event }: { event: ICalendarEvent }) => (
          <AgendaEventItem event={event as ICalendarEvent} />
        )
      }
    }),
    []
  )

  const updateEvent = useCallback(
    async ({ event, start, end }: EventInteractionArgs<ICalendarEvent>) => {
      queryClient.setQueryData(queryKey, (prevEvents: ICalendarEvent[]) => {
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
      })

      await fetchAPI<ICalendarEvent>(
        import.meta.env.VITE_API_HOST,
        `calendar/events/${event.id}`,
        {
          method: 'PATCH',
          body: {
            title: event.title,
            start: dayjs(start).toISOString(),
            end: dayjs(end).toISOString(),
            category: event.category
          }
        }
      )
    },
    [queryClient, queryKey]
  )

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      open(ModifyEventModal, {
        type: 'create',
        existedData: {
          id: '',
          title: '',
          start,
          end: dayjs(end).subtract(1, 'minute').toDate(),
          category: '',
          location: '',
          reference_link: ''
        }
      })
    },
    []
  )

  const handleEventChange = useCallback((e: EventInteractionArgs<object>) => {
    updateEvent(e as EventInteractionArgs<ICalendarEvent>).catch(console.error)
  }, [])

  const draggableAccessor = useCallback((event: ICalendarEvent) => {
    return !(event.category.startsWith('_') || event.type === 'recurring')
  }, [])

  return (
    <DnDCalendar
      selectable
      components={calendarComponents as any}
      draggableAccessor={draggableAccessor}
      events={filteredEvents}
      localizer={localizer}
      onEventDrop={handleEventChange}
      onEventResize={handleEventChange}
      onRangeChange={handleDateRangeChange}
      onSelectSlot={handleSelectSlot}
    />
  )
}

export default CalendarComponent
