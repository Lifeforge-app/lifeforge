import { usePersonalization } from '@providers/PersonalizationProvider'
import dayjs from 'dayjs'

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
  categories: ICalendarCategory[]
}) {
  const { language } = usePersonalization()

  console.log('MiniCalendarContent')

  return (
    <div className="grid grid-cols-7 gap-4">
      {{
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        'zh-CN': ['日', '一', '二', '三', '四', '五', '六'],
        'zh-TW': ['日', '一', '二', '三', '四', '五', '六'],
        ms: ['Ah', 'Is', 'Se', 'Ra', 'Kh', 'Ju', 'Sa']
      }[language ?? 'en']?.map(day => (
        <div key={day} className="flex-center text-bg-500 text-sm">
          {day}
        </div>
      ))}
      {Array(
        Math.ceil(
          (dayjs().year(currentYear).month(currentMonth).daysInMonth() +
            dayjs()
              .year(currentYear)
              .month(currentMonth - 1)
              .endOf('month')
              .day() +
            1) /
            7
        ) * 7
      )
        .fill(0)
        .map((_, index) =>
          (() => {
            const date = dayjs(
              `${currentYear}-${currentMonth + 1}-01`,
              'YYYY-M-DD'
            ).toDate()

            const firstDay = dayjs(date).startOf('month').day()
            const lastDate = dayjs(date).endOf('month').date()

            const lastDateOfPrevMonth = dayjs(date)
              .subtract(1, 'month')
              .endOf('month')
              .date()

            const actualIndex = (() => {
              // filling the first week date that is not in this month
              if (firstDay > index) {
                return lastDateOfPrevMonth - firstDay + index
              }

              // filling the last week date that is not in this month
              if (index - firstDay + 1 > lastDate) {
                return index - lastDate - firstDay
              }

              // filling the date that is in this month
              return index - firstDay
            })()

            return (
              <MiniCalendarDateItem
                key={index}
                actualIndex={actualIndex + 1}
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
