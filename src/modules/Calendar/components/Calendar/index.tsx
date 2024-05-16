/* eslint-disable @typescript-eslint/indent */
import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, { useCallback } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { toast } from 'react-toastify'
import { type ICalendarCategory, type ICalendarEvent } from '@typedec/Calendar'
import CalendarHeader from './components/CalendarHeader'
import EventItem from './components/EventItem'

const localizer = momentLocalizer(moment)
const DnDCalendar = withDragAndDrop(Calendar)

function CalendarComponent({
  events,
  setRawEvents,
  categories,
  setModifyEventModalOpenType,
  setExistedData,
  refreshRawEvents
}: {
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
}): React.ReactElement {
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
      localizer={localizer}
      draggableAccessor={() => {
        return true
      }}
      onEventDrop={({
        event,
        start,
        end
      }: {
        event: ICalendarEvent
        start: Date
        end: Date
      }) => {
        fetch(
          `${import.meta.env.VITE_API_HOST}/calendar/event/update/${event.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${cookieParse(document.cookie).token}`
            },
            body: JSON.stringify({
              title: event.title,
              start: moment(start).toISOString(),
              end: moment(end).toISOString(),
              category: event.category
            })
          }
        )
          .then(async res => {
            const data = await res.json()
            if (!res.ok) {
              throw data.message
            }
            refreshRawEvents()
            toast.success('Yay! Event updated.')
          })
          .catch(err => {
            toast.error("Oops! Couldn't update the event. Please try again.")
            console.error(err)
          })
      }}
      onEventResize={({
        event,
        start,
        end
      }: {
        event: ICalendarEvent
        start: Date
        end: Date
      }) => {
        fetch(
          `${import.meta.env.VITE_API_HOST}/calendar/event/update/${event.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${cookieParse(document.cookie).token}`
            },
            body: JSON.stringify({
              title: event.title,
              start: moment(start).toISOString(),
              end: moment(end).toISOString(),
              category: event.category
            })
          }
        )
          .then(async res => {
            const data = await res.json()
            if (!res.ok) {
              throw data.message
            }
            refreshRawEvents()
            toast.success('Yay! Event updated.')
          })
          .catch(err => {
            toast.error("Oops! Couldn't update the event. Please try again.")
            console.error(err)
          })
      }}
      onSelectSlot={handleSelectSlot}
      selectable
      events={events}
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
