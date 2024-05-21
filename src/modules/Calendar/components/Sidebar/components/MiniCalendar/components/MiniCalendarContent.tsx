import moment from 'moment'
import React from 'react'
import { type ICalendarCategory, type ICalendarEvent } from '@typedec/Calendar'
import MiniCalendarDateItem from './MiniCalendarDateItem'

function MiniCalendarContent({
  currentMonth,
  currentYear,
  events,
  categories
}: {
  currentMonth: number
  currentYear: number
  events: ICalendarEvent[]
  categories: ICalendarCategory[] | 'loading' | 'error'
}): React.ReactElement {
  return (
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
              <MiniCalendarDateItem
                key={index}
                index={index}
                actualIndex={actualIndex}
                firstDay={firstDay}
                lastDate={lastDate}
                date={date}
                events={events}
                categories={categories}
              />
            )
          })()
        )}
    </div>
  )
}

export default MiniCalendarContent
