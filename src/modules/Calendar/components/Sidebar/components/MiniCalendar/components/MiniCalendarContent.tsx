import { usePersonalization } from '@providers/PersonalizationProvider'
import moment from 'moment'
import React from 'react'

import { type Loadable } from '@interfaces/common'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../../../../interfaces/calendar_interfaces'
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
  categories: Loadable<ICalendarCategory[]>
}): React.ReactElement {
  const { language } = usePersonalization()

  return (
    <div className="grid grid-cols-7 gap-4">
      {{
        en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        'zh-CN': ['一', '二', '三', '四', '五', '六', '日'],
        'zh-TW': ['一', '二', '三', '四', '五', '六', '日'],
        ms: ['Is', 'Se', 'Ra', 'Kh', 'Ju', 'Sa', 'Ah']
      }[language ?? 'en']?.map(day => (
        <div key={day} className="flex-center text-bg-500 text-sm">
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

            const actualIndex = (() => {
              if (firstDay > index) {
                return lastDateOfPrevMonth - firstDay + index + 2
              }

              if (index - firstDay + 1 > lastDate) {
                return index - lastDate - firstDay + 1
              }

              return index - firstDay + 1
            })()

            return (
              <MiniCalendarDateItem
                key={index}
                actualIndex={actualIndex}
                categories={categories}
                date={date}
                events={events}
                firstDay={firstDay}
                index={index}
                lastDate={lastDate}
              />
            )
          })()
        )}
    </div>
  )
}

export default MiniCalendarContent
