/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, { useCallback, useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { toast } from 'react-toastify'
import Button from '@components/Button'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import useFetch from '@hooks/useFetch'
import { type ICalendarCategory, type ICalendarEvent } from '@typedec/Calendar'
import CategoryList from './CategoryList'
import MiniCalendar from './MiniCalendar'
import ModifyEventModal from './ModifyEventModal'

const localizer = momentLocalizer(moment)
const DnDCalendar = withDragAndDrop(Calendar)

function CalendarModule(): React.ReactElement {
  const [rawEvents, refreshRawEvents, setRawEvents] = useFetch<
    ICalendarEvent[]
  >('calendar/event/list')
  const [categories, refreshCategories] = useFetch<ICalendarCategory[]>(
    'calendar/category/list'
  )
  const [events, setEvents] = useState<ICalendarEvent[]>([])
  const [modifyEventModalOpenType, setModifyEventModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [existedData, setExistedData] = useState<ICalendarEvent | null>(null)

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

  useEffect(() => {
    if (typeof rawEvents !== 'string') {
      setEvents(
        rawEvents.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }))
      )
    }
  }, [rawEvents])

  return (
    <>
      <ModuleWrapper>
        <ModuleHeader
          title="Calendar"
          desc="Make sure you don't miss important event."
        />
        <div className="mb-12 mt-6 flex min-h-0 w-full flex-1">
          <aside className="flex h-full w-1/4 min-w-0 shrink-0 grow-0 flex-col gap-4">
            <MiniCalendar events={events} categories={categories} />
            <CategoryList
              categories={categories}
              refreshCategories={refreshCategories}
            />
          </aside>
          <div className="ml-8 flex h-full w-full flex-col">
            <div className="h-full w-full">
              <DnDCalendar
                localizer={localizer}
                draggableAccessor={event => {
                  return true
                }}
                onEventDrop={({ event, start, end }) => {
                  fetch(
                    `${import.meta.env.VITE_API_HOST}/calendar/event/update/${
                      event.id
                    }`,
                    {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${
                          cookieParse(document.cookie).token
                        }`
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
                      toast.error(
                        "Oops! Couldn't update the event. Please try again."
                      )
                      console.error(err)
                    })
                }}
                onEventResize={({ event, start, end }) => {
                  fetch(
                    `${import.meta.env.VITE_API_HOST}/calendar/event/update/${
                      event.id
                    }`,
                    {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${
                          cookieParse(document.cookie).token
                        }`
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
                      toast.error(
                        "Oops! Couldn't update the event. Please try again."
                      )
                      console.error(err)
                    })
                }}
                onSelectSlot={handleSelectSlot}
                selectable
                events={events}
                components={{
                  toolbar: ({
                    label,
                    onNavigate,
                    onView,
                    view: currentView
                  }) => {
                    return (
                      <div className="mb-4 flex w-full items-end justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => {
                              onNavigate('PREV')
                            }}
                            className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-900"
                          >
                            <Icon icon="uil:angle-left" className="h-6 w-6" />
                          </button>
                          <div className="text-center text-2xl font-bold">
                            {label}
                          </div>
                          <button
                            onClick={() => {
                              onNavigate('NEXT')
                            }}
                            className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-900"
                          >
                            <Icon icon="uil:angle-right" className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex gap-1 rounded-md bg-bg-900 p-2">
                            {['Month', 'Week', 'Day', 'Agenda'].map(view => (
                              <button
                                key={view}
                                onClick={() => {
                                  onView(
                                    view.toLowerCase() as
                                      | 'month'
                                      | 'week'
                                      | 'day'
                                      | 'agenda'
                                  )
                                }}
                                className={`rounded-md p-2 px-4 transition-all hover:bg-bg-800 ${
                                  view.toLowerCase() === currentView
                                    ? 'bg-bg-800 text-bg-200'
                                    : 'text-bg-500'
                                }`}
                              >
                                {view}
                              </button>
                            ))}
                          </div>
                          <Button
                            icon="tabler:plus"
                            onClick={() => {
                              setModifyEventModalOpenType('create')
                            }}
                          >
                            Add Event
                          </Button>
                        </div>
                      </div>
                    )
                  },
                  event: ({ event }: { event: ICalendarEvent }) => {
                    return (
                      <div
                        onClick={() => {
                          setModifyEventModalOpenType('update')
                          setExistedData(event)
                        }}
                        className="rbc-event flex items-center gap-2 rounded-md bg-bg-800"
                        style={{
                          border: 'none'
                        }}
                      >
                        {typeof categories !== 'string' &&
                          event.category !== '' && (
                            <span
                              className="h-4 w-1 rounded-full"
                              style={{
                                backgroundColor: categories.find(
                                  category => category.id === event.category
                                )?.color
                              }}
                            />
                          )}
                        <span className="truncate">{event.title}</span>
                      </div>
                    )
                  }
                }}
              />
            </div>
          </div>
        </div>
      </ModuleWrapper>
      <ModifyEventModal
        openType={modifyEventModalOpenType}
        setOpenType={setModifyEventModalOpenType}
        existedData={existedData}
        updateEventList={() => {
          refreshRawEvents()
          refreshCategories()
        }}
        categories={categories}
      />
    </>
  )
}

export default CalendarModule
