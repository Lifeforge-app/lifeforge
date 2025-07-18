import { Button } from '@components/buttons'
import { Select } from '@headlessui/react'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import { range } from 'lodash'
import React from 'react'

function CalendarHeader({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled
}: {
  date: Date
  changeYear: (year: number) => void
  changeMonth: (month: number) => void
  decreaseMonth: () => void
  increaseMonth: () => void
  prevMonthButtonDisabled: boolean
  nextMonthButtonDisabled: boolean
}) {
  const years = range(1990, dayjs().year() + 10)

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  return (
    <div className="flex-between text-bg-800 dark:text-bg-100 px-4 py-2">
      <Button
        className="dark:hover:bg-bg-700/30! p-2!"
        disabled={prevMonthButtonDisabled}
        icon="tabler:chevron-left"
        variant="plain"
        onClick={decreaseMonth}
      />
      <div className="flex items-center gap-2">
        <div className="relative">
          <Select
            className="hover:bg-bg-200/30 dark:hover:bg-bg-700/30 appearance-none rounded-md px-3 py-2 pr-8 text-base font-medium transition-all"
            value={dayjs(date).year()}
            onChange={({ target: { value } }) => changeYear(+value)}
          >
            {years.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <Icon
            className="text-bg-500 absolute top-1/2 right-3 size-4.5 -translate-y-1/2"
            icon="uil:angle-down"
          />
        </div>
        <div className="relative">
          <Select
            className="hover:bg-bg-200/30 dark:hover:bg-bg-700/30 appearance-none rounded-md px-3 py-2 pr-8 text-base font-medium transition-all"
            value={months[dayjs(date).month()]}
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
          >
            {months.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <Icon
            className="text-bg-500 absolute top-1/2 right-3 size-4.5 -translate-y-1/2"
            icon="uil:angle-down"
          />
        </div>
      </div>
      <Button
        className="dark:hover:bg-bg-700/30! p-2!"
        disabled={nextMonthButtonDisabled}
        icon="tabler:chevron-right"
        variant="plain"
        onClick={increaseMonth}
      />
    </div>
  )
}

export default CalendarHeader
