import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useMemo } from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { useSearchParams } from 'react-router'

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
  queryKey: unknown[]
  events: ICalendarEvent[]
  categories: ICalendarCategory[]
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
  refetchEvents: (range: Date[] | { start: Date; end: Date }) => void
}

function CalendarComponent({
  queryKey,
  events,
  categories,
  setIsDeleteEventConfirmationModalOpen,
  setModifyEventModalOpenType,
  setScanImageModalOpen,
  setExistedData,
  refetchEvents
}: CalendarComponentProps) {
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const calendarComponents = useMemo(
    () => ({
      toolbar: (props: any) => {
        return (
          <CalendarHeader
            {...props}
            refreshEvents={refetchEvents}
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
          queryKey: queryKey
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
    [setExistedData, setModifyEventModalOpenType]
  )

  return (
    <DnDCalendar
      selectable
      components={calendarComponents as any}
      draggableAccessor={event => {
        return !(event as ICalendarEvent).category.startsWith('_')
      }}
      events={events.filter(event => {
        if (searchParams.has('category')) {
          return event.category === searchParams.get('category')
        }
        return true
      })}
      localizer={localizer}
      onEventDrop={(e: any) => {
        updateEvent(e).catch(console.error)
      }}
      onEventResize={(e: any) => {
        updateEvent(e).catch(console.error)
      }}
      onRangeChange={refetchEvents}
      onSelectSlot={handleSelectSlot}
    />
  )
}

export default CalendarComponent
