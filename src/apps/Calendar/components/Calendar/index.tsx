import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useMemo } from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import { useCalendarStore } from '@apps/Calendar/stores/useCalendarStore'

import fetchAPI from '@utils/fetchAPI'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../interfaces/calendar_interfaces'
import AgendaDate from './components/AgendaView/AgendaDate'
import AgendaEventItem from './components/AgendaView/AgendaEventItem'
import EventItem from './components/EventItem'
import CalendarHeader from './components/Headers/CalendarHeader'
import WeekHeader from './components/Headers/WeekHeader'

const localizer = dayjsLocalizer(dayjs)
const DnDCalendar = withDragAndDrop(Calendar)

interface CalendarComponentProps {
  events: ICalendarEvent[]
  categories: ICalendarCategory[]
  selectedCategory: string | undefined
  setIsDeleteEventConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setScanImageModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setExistedData: React.Dispatch<
    React.SetStateAction<Partial<ICalendarEvent> | null>
  >
}

function CalendarComponent({
  events,
  categories,
  selectedCategory,
  setIsDeleteEventConfirmationModalOpen,
  setModifyEventModalOpenType,
  setScanImageModalOpen,
  setExistedData
}: CalendarComponentProps) {
  const queryClient = useQueryClient()
  const { eventQueryKey: queryKey, setEventQueryKey } = useCalendarStore()

  const filteredEvents = useMemo(
    () =>
      events.filter(event => {
        if (selectedCategory) {
          return event.category === selectedCategory
        }
        return true
      }),
    [events, selectedCategory]
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
        return (
          <CalendarHeader
            {...props}
            setExistedData={setExistedData}
            setModifyEventModalOpenType={setModifyEventModalOpenType}
            setScanImageModalOpen={setScanImageModalOpen}
          />
        )
      },
      event: ({
        event
      }: {
        event: ICalendarEvent | Record<string, unknown>
        props: any
      }) => {
        return (
          <EventItem
            categories={categories}
            event={event as ICalendarEvent}
            setExistedData={setExistedData}
            setIsDeleteEventConfirmationModalOpen={
              setIsDeleteEventConfirmationModalOpen
            }
            setModifyEventModalOpenType={setModifyEventModalOpenType}
          />
        )
      },
      week: {
        header: WeekHeader
      },
      agenda: {
        date: AgendaDate,
        event: ({ event }: { event: ICalendarEvent }) => (
          <AgendaEventItem
            categories={categories}
            event={event as ICalendarEvent}
            setExistedData={setExistedData}
            setIsDeleteEventConfirmationModalOpen={
              setIsDeleteEventConfirmationModalOpen
            }
            setModifyEventModalOpenType={setModifyEventModalOpenType}
          />
        )
      }
    }),
    [categories, setExistedData, setModifyEventModalOpenType]
  )

  const updateEvent = useCallback(
    async ({
      event,
      start,
      end
    }: {
      event: ICalendarEvent
      start: Date
      end: Date
    }) => {
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

      try {
        await fetchAPI<ICalendarEvent>(`calendar/events/${event.id}`, {
          method: 'PATCH',
          body: {
            title: event.title,
            start: dayjs(start).toISOString(),
            end: dayjs(end).toISOString(),
            category: event.category
          }
        })
      } catch {
        queryClient.invalidateQueries({
          queryKey
        })
      }
    },
    [queryClient, queryKey]
  )

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setModifyEventModalOpenType('create')
      setExistedData({
        id: '',
        title: '',
        start,
        end: dayjs(end).subtract(1, 'minute').toDate(),
        category: '',
        location: '',
        reference_link: ''
      })
    },
    []
  )

  const handleEvenChange = useCallback((e: any) => {
    updateEvent(e).catch(console.error)
  }, [])

  const draggableAccessor = useCallback((event: any) => {
    return !(event.category.startsWith('_') || event.type === 'recurring')
  }, [])

  return (
    <DnDCalendar
      selectable
      components={calendarComponents as any}
      draggableAccessor={draggableAccessor}
      events={filteredEvents}
      localizer={localizer}
      onEventDrop={handleEvenChange}
      onEventResize={handleEvenChange}
      onRangeChange={handleDateRangeChange}
      onSelectSlot={handleSelectSlot}
    />
  )
}

export default CalendarComponent
