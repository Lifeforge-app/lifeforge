import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'

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
  return (
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
  )
}

export default MiniCalendarHeader
