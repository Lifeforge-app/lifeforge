import moment from 'moment'
import React from 'react'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
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
  const { language } = usePersonalizationContext()

  return (
    <div className="grid grid-cols-7 gap-4">
      {{
        en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        'zh-CN': ['一', '二', '三', '四', '五', '六', '日'],
        'zh-TW': ['一', '二', '三', '四', '五', '六', '日'],
        ms: ['Is', 'Se', 'Ra', 'Kh', 'Ju', 'Sa', 'Ah']
      }[language ?? 'en']?.map(day => (
        <div key={day} className="flex-center text-sm text-bg-500">
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
              `${currentYear}-${currentMonth + 1}-01`,
              'YYYY-M-DD'
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
