/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React, { useState } from 'react'
import { type ICalendarCategory, type ICalendarEvent } from '@typedec/Calendar'

function MiniCalendar({
  events,
  categories
}: {
  events: ICalendarEvent[]
  categories: ICalendarCategory[] | 'loading' | 'error'
}): React.ReactElement {
  const [currentMonth, setCurrentMonth] = useState(moment().month())
  const [currentYear, setCurrentYear] = useState(moment().year())

  return (
    <section className="flex w-full flex-col gap-4 rounded-lg bg-bg-50 p-8 pt-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
      <div className="h-full w-full">
        <div className="mb-6 flex items-center justify-between gap-2">
          <div className="whitespace-nowrap text-lg font-semibold text-bg-800 dark:text-bg-100">
            {moment().month(currentMonth).year(currentYear).format('MMMM YYYY')}
          </div>
          <div className="-mr-4 flex gap-1">
            <button
              onClick={() => {
                setCurrentMonth(currentMonth - 1)
                if (currentMonth === 0) {
                  setCurrentYear(currentYear - 1)
                  setCurrentMonth(11)
                }
              }}
              className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-100 dark:hover:bg-bg-700/50"
            >
              <Icon icon="uil:angle-left" className="h-6 w-6" />
            </button>
            <button
              onClick={() => {
                setCurrentMonth(currentMonth + 1)
                if (currentMonth === 11) {
                  setCurrentYear(currentYear + 1)
                  setCurrentMonth(0)
                }
              }}
              className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-100 dark:hover:bg-bg-700/50"
            >
              <Icon icon="uil:angle-right" className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="flex-center flex text-sm text-bg-500">
              {day}
            </div>
          ))}
          {Array(
            Math.ceil(
              (moment().year(currentYear).month(currentMonth).daysInMonth() +
                moment()
                  .year(currentYear)
                  .month(currentMonth - 1)
                  .endOf('month')
                  .day()) /
                7
            ) * 7
          )
            .fill(0)
            .map((_, index) =>
              (() => {
                const date = moment(
                  `${currentYear}-${currentMonth + 1}-01`
                ).toDate()

                let firstDay = moment(date).startOf('month').day() - 1
                firstDay = firstDay === -1 ? 6 : firstDay

                const lastDate = moment(date).endOf('month').date()

                const lastDateOfPrevMonth =
                  moment(date).subtract(1, 'month').endOf('month').date() - 1

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
                      moment().isSame(
                        moment(
                          `${date.getFullYear()}-${
                            date.getMonth() + 1
                          }-${actualIndex}`
                        ),
                        'day'
                      )
                        ? "font-semibold after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:h-10 after:w-10 after:-translate-x-1/2 after:-translate-y-6 after:rounded-md after:border after:border-custom-500 after:bg-custom-500/10 after:content-['']"
                        : ''
                    }`}
                  >
                    <span>{actualIndex}</span>
                    {(() => {
                      const eventsOnTheDay = !(
                        firstDay > index || index - firstDay + 1 > lastDate
                      )
                        ? events.filter(event =>
                            moment(
                              `${date.getFullYear()}-${
                                date.getMonth() + 1
                              }-${actualIndex}`
                            ).isBetween(
                              moment(event.start),
                              moment(event.end).subtract(1, 'second'),
                              'day',
                              '[]'
                            )
                          )
                        : []

                      return (
                        eventsOnTheDay.length > 0 && (
                          <div className="flex w-full items-center justify-center gap-[1px]">
                            {eventsOnTheDay.slice(0, 3).map(event => (
                              <div
                                key={event.id}
                                style={{
                                  backgroundColor:
                                    typeof categories !== 'string'
                                      ? categories.find(
                                          category =>
                                            category.id === event.category
                                        )?.color
                                      : ''
                                }}
                                className={'h-1 w-1 rounded-full'}
                              />
                            ))}
                          </div>
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
  )
}

export default MiniCalendar
