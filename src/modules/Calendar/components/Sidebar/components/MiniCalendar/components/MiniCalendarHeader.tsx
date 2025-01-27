import { Icon } from '@iconify/react'
import moment from 'moment/min/moment-with-locales'
import React from 'react'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'

function MiniCalendarHeader({
  currentMonth,
  setCurrentMonth,
  currentYear,
  setCurrentYear
}: {
  currentMonth: number
  setCurrentMonth: React.Dispatch<React.SetStateAction<number>>
  currentYear: number
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>
}): React.ReactElement {
  const { language } = usePersonalizationContext()

  return (
    <div className="flex-between mb-4 flex gap-2">
      <div className="whitespace-nowrap text-lg font-semibold ">
        {moment()
          .year(currentYear)
          .month(currentMonth)
          .locale(language)
          .format(language.startsWith('zh') ? 'YYYY[年] MMM' : 'MMMM YYYY')}
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
          className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-100 hover:text-bg-50 dark:hover:bg-bg-700/50"
        >
          <Icon icon="uil:angle-left" className="size-6" />
        </button>
        <button
          onClick={() => {
            setCurrentMonth(currentMonth + 1)
            if (currentMonth === 11) {
              setCurrentYear(currentYear + 1)
              setCurrentMonth(0)
            }
          }}
          className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-100 hover:text-bg-50 dark:hover:bg-bg-700/50"
        >
          <Icon icon="uil:angle-right" className="size-6" />
        </button>
      </div>
    </div>
  )
}

export default MiniCalendarHeader
