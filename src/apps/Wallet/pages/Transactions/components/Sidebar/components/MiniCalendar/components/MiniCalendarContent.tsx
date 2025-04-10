import { usePersonalization } from '@providers/PersonalizationProvider'
import dayjs from 'dayjs'
import { useState } from 'react'

import MiniCalendarDateItem from './MiniCalendarDateItem'

function MiniCalendarContent({
  currentMonth,
  currentYear,
  viewsFilter
}: {
  currentMonth: number
  currentYear: number
  viewsFilter: ('income' | 'expenses' | 'transfer')[]
}) {
  const { language } = usePersonalization()
  const [nextToSelect, setNextToSelect] = useState<'start' | 'end'>('start')

  return (
    <div className="grid grid-cols-7 gap-y-2">
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
          (dayjs().year(currentYear).month(currentMonth).daysInMonth() +
            dayjs()
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
            const date = dayjs(
              `${currentYear}-${currentMonth + 1}-01`,
              'YYYY-M-DD'
            ).toDate()

            let firstDay = dayjs(date).startOf('month').day() - 1
            firstDay = firstDay === -1 ? 6 : firstDay

            const lastDate = dayjs(date).endOf('month').date()

            const lastDateOfPrevMonth =
              dayjs(date).subtract(1, 'month').endOf('month').date() - 1

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
                date={date}
                firstDay={firstDay}
                index={index}
                lastDate={lastDate}
                nextToSelect={nextToSelect}
                setNextToSelect={setNextToSelect}
                viewsFilter={viewsFilter}
              />
            )
          })()
        )}
    </div>
  )
}

export default MiniCalendarContent
