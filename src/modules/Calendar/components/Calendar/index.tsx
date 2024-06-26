/* eslint-disable @typescript-eslint/member-delimiter-style */

import moment from 'moment'
import React, { useCallback } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { useSearchParams } from 'react-router-dom'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import APIRequest from '@utils/fetchData'
import CalendarHeader from './components/CalendarHeader'
import EventItem from './components/EventItem'

const localizer = momentLocalizer(moment)
const DnDCalendar = withDragAndDrop(Calendar)

interface CalendarComponentProps {
  events: ICalendarEvent[]
  setRawEvents: React.Dispatch<
    React.SetStateAction<ICalendarEvent[] | 'loading' | 'error'>
  >
  categories: ICalendarCategory[] | 'loading' | 'error'
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
      failureInfo: "Oops! Couldn't update the event. Please try again.",
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
    // @ts-expect-error - cannot fix
    <DnDCalendar
      localizer={localizer}
      draggableAccessor={() => {
        return true
      }}
      onEventDrop={e => {
        // @ts-expect-error - I don't know how to fix this ;-;
        updateEvent(e).catch(console.error)
      }}
      onEventResize={e => {
        // @ts-expect-error - I don't know how to fix this ;-;
        updateEvent(e).catch(console.error)
      }}
      onSelectSlot={handleSelectSlot}
      selectable
      events={events.filter(event => {
        if (searchParams.has('category')) {
          return event.category === searchParams.get('category')
        }
        return true
      })}
      components={{
        toolbar: props => {
          return (
            <CalendarHeader
              {...props}
              setModifyEventModalOpenType={setModifyEventModalOpenType}
            />
          )
        },
        event: ({ event }) => {
          return (
            <EventItem
              event={event as ICalendarEvent}
              categories={categories}
              setModifyEventModalOpenType={setModifyEventModalOpenType}
              setExistedData={setExistedData}
            />
          )
        }
      }}
    />
  )
}

export default CalendarComponent
