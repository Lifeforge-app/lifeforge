import { useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import { useCallback } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { useSearchParams } from 'react-router'

import { type Loadable } from '@interfaces/common'

import fetchAPI from '@utils/fetchAPI'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../interfaces/calendar_interfaces'
import CalendarHeader from './components/CalendarHeader'
import EventItem from './components/EventItem'

const localizer = momentLocalizer(moment)
const DnDCalendar: any = withDragAndDrop(Calendar)

interface CalendarComponentProps {
  queryKey: unknown[]
  events: ICalendarEvent[]
  categories: Loadable<ICalendarCategory[]>
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarEvent | null>>
  setStart: React.Dispatch<React.SetStateAction<string>>
  setEnd: React.Dispatch<React.SetStateAction<string>>
}

function CalendarComponent({
  queryKey,
  events,
  categories,
  setModifyEventModalOpenType,
  setExistedData,
  setStart,
  setEnd
}: CalendarComponentProps) {
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()

  async function updateEvent({
    event,
    start,
    end
  }: {
    event: ICalendarEvent
    start: Date
    end: Date
  }) {
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
          start: moment(start).toISOString(),
          end: moment(end).toISOString(),
          category: event.category
        }
      })
    } catch {
      queryClient.invalidateQueries({
        queryKey: queryKey
      })
    }
  }

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setModifyEventModalOpenType('create')
      setExistedData({
        id: '',
        title: '',
        start,
        end,
        category: '',
        collectionId: '',
        collectionName: '',
        created: '',
        updated: ''
      })
    },
    []
  )

  return (
    <DnDCalendar
      selectable
      components={{
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
      }}
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
      onRangeChange={({ start, end }: { start: Date; end: Date }) => {
        setStart(moment(start).format('YYYY-MM-DD'))
        setEnd(moment(end).format('YYYY-MM-DD'))
      }}
      onSelectSlot={handleSelectSlot}
    />
  )
}

export default CalendarComponent
