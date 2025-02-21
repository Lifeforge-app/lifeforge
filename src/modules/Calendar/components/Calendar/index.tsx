import moment from 'moment'
import React, { useCallback } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { useSearchParams } from 'react-router'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import { type Loadable } from '@interfaces/common'
import APIRequest from '@utils/fetchData'
import CalendarHeader from './components/CalendarHeader'
import EventItem from './components/EventItem'

const localizer = momentLocalizer(moment)
const DnDCalendar: any = withDragAndDrop(Calendar)

interface CalendarComponentProps {
  events: ICalendarEvent[]
  setRawEvents: React.Dispatch<React.SetStateAction<Loadable<ICalendarEvent[]>>>
  categories: Loadable<ICalendarCategory[]>
  setModifyEventModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarEvent | null>>
  refreshRawEvents: () => void
}

function CalendarComponent({
  events,
  setRawEvents,
  categories,
  setModifyEventModalOpenType,
  setExistedData,
  refreshRawEvents
}: CalendarComponentProps): React.ReactElement {
  const [searchParams] = useSearchParams()

  async function updateEvent({
    event,
    start,
    end
  }: {
    event: ICalendarEvent
    start: Date
    end: Date
  }): Promise<void> {
    setRawEvents(prevEvents => {
      if (typeof prevEvents === 'string') {
        return prevEvents
      }

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

    await APIRequest({
      endpoint: `calendar/event/${event.id}`,
      method: 'PATCH',
      body: {
        title: event.title,
        start: moment(start).toISOString(),
        end: moment(end).toISOString(),
        category: event.category
      },
      failureInfo: 'update',
      onFailure: refreshRawEvents
    })
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
    [setRawEvents]
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
      onSelectSlot={handleSelectSlot}
    />
  )
}

export default CalendarComponent
