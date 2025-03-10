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
      <div className="text-lg font-semibold whitespace-nowrap">
        {moment()
          .year(currentYear)
          .month(currentMonth)
          .locale(language)
          .format(language.startsWith('zh') ? 'YYYY[年] MM月' : 'MMMM YYYY')}
      </div>
      <div className="-mr-4 flex gap-1">
        <button
          className="text-bg-500 hover:bg-bg-100 hover:text-bg-50 dark:hover:bg-bg-700/50 rounded-lg p-2 transition-all"
          onClick={() => {
            setCurrentMonth(currentMonth - 1)
            if (currentMonth === 0) {
              setCurrentYear(currentYear - 1)
              setCurrentMonth(11)
            }
          }}
        >
          <Icon className="size-6" icon="uil:angle-left" />
        </button>
        <button
          className="text-bg-500 hover:bg-bg-100 hover:text-bg-50 dark:hover:bg-bg-700/50 rounded-lg p-2 transition-all"
          onClick={() => {
            setCurrentMonth(currentMonth + 1)
            if (currentMonth === 11) {
              setCurrentYear(currentYear + 1)
              setCurrentMonth(0)
            }
          }}
        >
          <Icon className="size-6" icon="uil:angle-right" />
        </button>
      </div>
    </div>
  )
}

export default MiniCalendarHeader
