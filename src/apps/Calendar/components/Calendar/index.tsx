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
import CalendarHeader from './components/CalendarHeader'
import EventItem from './components/EventItem'

const localizer = dayjsLocalizer(dayjs)
const DnDCalendar = withDragAndDrop(Calendar)

interface CalendarComponentProps {
  queryKey: unknown[]
  events: ICalendarEvent[]
  categories: ICalendarCategory[]
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarEvent | null>>
  refetchEvents: (range: Date[] | { start: Date; end: Date }) => void
}

function CalendarComponent({
  queryKey,
  events,
  categories,
  setModifyEventModalOpenType,
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
            setModifyEventModalOpenType={setModifyEventModalOpenType}
          />
        )
      },
      event: ({
        event
      }: {
        event: ICalendarEvent | Record<string, unknown>
      }) => {
        return (
          <EventItem
            categories={categories}
            event={event as ICalendarEvent}
            setExistedData={setExistedData}
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
        end,
        category: '',
        location: '',
        collectionId: '',
        collectionName: '',
        created: '',
        updated: ''
      })
    },
    [setExistedData, setModifyEventModalOpenType]
  )

  return (
    <DnDCalendar
      selectable
      components={calendarComponents as any}
      draggableAccessor={() => {
        return true
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
