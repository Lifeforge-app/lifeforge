import YearMonthSelector from '@/components/modals/YearMonthSelector'
import dayjs from 'dayjs'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import type { NavigateAction } from 'react-big-calendar'

function DateRangeLabel({
  label,
  onNavigate
}: {
  label: string
  onNavigate?: (direction: NavigateAction, date?: Date) => void
}) {
  const open = useModalStore(state => state.open)

  const handleOpenYearMonthSelector = useCallback(() => {
    if (onNavigate) {
      open(YearMonthSelector, {
        onSelect: (year: number, month: number) => {
          onNavigate('DATE', new Date(year, month - 1, 1))
        }
      })
    }
  }, [onNavigate])

  if (label.match(/^(\w+)\s(\w+)$/)) {
    return (
      <button
        className="hover:bg-bg-900 flex min-w-0 cursor-pointer items-end gap-2 rounded-md p-2 px-3 transition-all"
        onClick={handleOpenYearMonthSelector}
      >
        <span className="hidden w-full min-w-0 truncate sm:inline">
          {label.split(' ')[0]}
        </span>
        <span className="w-full min-w-0 truncate sm:hidden">
          {label.split(' ')[0].split('').slice(0, 3).join('')}
        </span>
        <span className="text-bg-500">{label.split(' ')[1]}</span>
      </button>
    )
  }

  if (label.match(/^\d/)) {
    const parts = label.split(' – ')

    if (parts.length !== 2) {
      return label
    }

    const startDate = dayjs(parts[0])

    const endDate = dayjs(parts[1])

    if (!startDate.isValid() || !endDate.isValid()) {
      return label
    }

    const start = startDate.format('MMM D')

    const end = endDate.format('MMM D')

    return (
      <>
        <span>{start}</span>
        <span className="text-bg-500"> - {end}</span>
      </>
    )
  }

  return label
}

export default DateRangeLabel
