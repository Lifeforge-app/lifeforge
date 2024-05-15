/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { toast } from 'react-toastify'
import Button from '@components/Button'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import useFetch from '@hooks/useFetch'
import { PersonalizationContext } from '@providers/PersonalizationProvider'
import { type ICalendarEvent } from '@typedec/Calendar'

const localizer = momentLocalizer(moment)
const DnDCalendar = withDragAndDrop(Calendar)

function CalendarModule(): React.ReactElement {
  const [rawEvents, refreshRawEvents, setRawEvents] = useFetch<
    ICalendarEvent[]
  >('calendar/event/list')
  const [events, setEvents] = useState<ICalendarEvent[]>([])
  const { language } = useContext(PersonalizationContext)

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      const title = window.prompt('New Event name')
      if (title !== null && title.trim() !== '') {
        fetch(`${import.meta.env.VITE_API_HOST}/calendar/event/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookieParse(document.cookie).token}`
          },
          body: JSON.stringify({
            title,
            start: moment(start).toISOString(),
            end: moment(end).toISOString()
          })
        })
          .then(async res => {
            const data = await res.json()
            if (!res.ok) {
              throw data.message
            }

            refreshRawEvents()
            toast.success('Yay! Event created.')
          })
          .catch(err => {
            toast.error("Oops! Couldn't create the event. Please try again.")
            console.error(err)
          })
      }
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
    <ModuleWrapper>
      <ModuleHeader
        title="Calendar"
        desc="Make sure you don't miss important event."
      />
      <div className="mb-12 mt-6 flex min-h-0 w-full flex-1">
        <aside className="flex h-full flex-col gap-4">
          <section className="flex w-full flex-col gap-4 rounded-lg bg-bg-50 p-8 pt-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
            <div className="h-full w-full">
              <div className="mb-6 flex items-center justify-between gap-2">
                <div className="whitespace-nowrap text-lg font-semibold text-bg-800 dark:text-bg-100">
                  {moment().format('MMMM YYYY')}
                </div>
                <div className="-mr-4 flex gap-1">
                  <button className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-100 dark:hover:bg-bg-700/50">
                    <Icon icon="uil:angle-left" className="h-6 w-6" />
                  </button>
                  <button className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-100 dark:hover:bg-bg-700/50">
                    <Icon icon="uil:angle-right" className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div
                    key={day}
                    className="flex-center flex text-sm text-bg-500"
                  >
                    {day}
                  </div>
                ))}
                {Array(35)
                  .fill(0)
                  .map((_, index) =>
                    (() => {
                      const date = new Date()
                      const firstDay =
                        new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          1
                        ).getDay() - 1

                      const lastDate = new Date(
                        date.getFullYear(),
                        date.getMonth() + 1,
                        0
                      ).getDate()

                      const lastDateOfPrevMonth =
                        new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          0
                        ).getDate() - 1

                      const actualIndex =
                        firstDay > index
                          ? lastDateOfPrevMonth - firstDay + index + 2
                          : index - firstDay + 1 > lastDate
                          ? index - lastDate - firstDay + 1
                          : index - firstDay + 1

                      return (
                        <div
                          key={index}
                          className={`relative isolate flex flex-col items-center gap-1 text-sm ${
                            firstDay > index || index - firstDay + 1 > lastDate
                              ? 'text-bg-300 dark:text-bg-600'
                              : 'text-bg-800 dark:text-bg-100'
                          } ${
                            actualIndex === date.getDate()
                              ? "font-semibold after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:h-10 after:w-10 after:-translate-x-1/2 after:-translate-y-6 after:rounded-md after:border after:border-custom-500 after:bg-custom-500/10 after:content-['']"
                              : ''
                          }`}
                        >
                          <span>{actualIndex}</span>
                          {(() => {
                            const hasEvent = Math.random() > 0.7

                            return (
                              hasEvent && (
                                <div className="h-0.5 w-3 rounded-full bg-rose-500" />
                              )
                            )
                          })()}
                        </div>
                      )
                    })()
                  )}
              </div>
            </div>
          </section>
          <section className="flex w-full flex-col gap-4 overflow-y-auto rounded-lg bg-bg-50 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
            <h2 className="px-8 pt-8 text-sm font-semibold uppercase tracking-widest text-bg-600 transition-all">
              Categories
            </h2>
            <ul className="flex flex-col overflow-y-hidden pb-4 hover:overflow-y-scroll">
              {[
                ['Holidays', 'bg-lime-500'],
                ['Tests / Exams', 'bg-blue-500'],
                ['Trips', 'bg-yellow-500'],
                ['Deadlines', 'bg-red-500'],
                ['Events', 'bg-purple-500']
              ].map(([name, color], index) => (
                <li
                  key={index}
                  className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
                >
                  <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                    <span
                      className={`block h-6 w-1 shrink-0 rounded-full ${color}`}
                    />
                    <div className="flex w-full items-center justify-between">
                      {name}
                    </div>
                    <span className="text-sm">
                      {Math.floor(Math.random() * 10)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
        <div className="ml-8 h-full min-h-[40rem] w-full overflow-y-auto">
          <DnDCalendar
            localizer={localizer}
            draggableAccessor={event => {
              return true
            }}
            onEventDrop={({ event, start, end }) => {
              fetch(`${import.meta.env.VITE_API_HOST}/calendar/event/update`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${cookieParse(document.cookie).token}`
                },
                body: JSON.stringify({
                  id: event.id,
                  start: moment(start).toISOString(),
                  end: moment(end).toISOString()
                })
              })
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
              fetch(`${import.meta.env.VITE_API_HOST}/calendar/event/update`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${cookieParse(document.cookie).token}`
                },
                body: JSON.stringify({
                  id: event.id,
                  start: moment(start).toISOString(),
                  end: moment(end).toISOString()
                })
              })
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
              toolbar: ({ label, onNavigate, onView, view: currentView }) => {
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
                      <Button icon="tabler:plus">Add Event</Button>
                    </div>
                  </div>
                )
              },
              event: ({ event }) => {
                return (
                  <div
                    onClick={() => {
                      alert('clicked')
                    }}
                    className="rbc-event flex items-center gap-2 rounded-md bg-bg-800"
                    style={{
                      border: 'none'
                    }}
                  >
                    <span className="h-4 w-1 rounded-full bg-custom-500" />
                    <span className="truncate">{event.title}</span>
                  </div>
                )
              }
            }}
          />
        </div>
      </div>
    </ModuleWrapper>
  )
}

export default CalendarModule
