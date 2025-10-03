import clsx from 'clsx'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { useWalletStore } from '@apps/03.Finance/wallet/stores/useWalletStore'

import getDayClassName from './utils/getDayClassName'
import getTransactionClassName from './utils/getTransactionClassName'

interface TransactionCount {
  income: number
  expenses: number
  transfer: number
  total: number
  count: number
}

interface MiniCalendarDateItemProps {
  index: number
  date: Date
  nextToSelect: 'start' | 'end'
  setNextToSelect: React.Dispatch<React.SetStateAction<'start' | 'end'>>
  transactionCountMap: Record<string, TransactionCount>
}

function MiniCalendarDateItem({
  index,
  date,
  nextToSelect,
  setNextToSelect,
  transactionCountMap
}: MiniCalendarDateItemProps) {
  const { startDate, endDate, setStartDate, setEndDate } = useWalletStore()

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

  const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`

  const transactionCount = transactionCountMap[dateKey] ?? {
    income: 0,
    expenses: 0,
    transfer: 0,
    total: 0,
    count: 0
  }

  const isFirstAndLastDay = useMemo(() => {
    const startDateParam = startDate

    const endDateParam = endDate

    const formattedDate = dayjs(
      `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
      'YYYY-M-D'
    )

    if (startDateParam && dayjs(startDateParam).isSame(formattedDate, 'day')) {
      return 'first'
    }

    if (endDateParam && dayjs(endDateParam).isSame(formattedDate, 'day')) {
      return 'last'
    }

    return ''
  }, [startDate, endDate, date, actualIndex])

  const isBetweenFirstAndLastDay = useMemo(() => {
    if (startDate === null || endDate === null) {
      return false
    }

    return (
      dayjs(startDate ?? dayjs().format('YYYY-M-D')).isBefore(
        dayjs(
          `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
          'YYYY-M-D'
        ),
        'day'
      ) &&
      dayjs(endDate ?? dayjs().format('YYYY-M-D')).isAfter(
        dayjs(
          `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
          'YYYY-M-D'
        ),
        'day'
      )
    )
  }, [startDate, endDate, date, actualIndex])

  return (
    <button
      key={index}
      className={clsx(
        'relative h-10',
        getDayClassName({
          index,
          firstDay,
          lastDate,
          startDate,
          endDate,
          isFirstAndLastDay,
          isBetweenFirstAndLastDay
        })
      )}
      onClick={() => {
        const target = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${actualIndex}`

        if (nextToSelect === 'start') {
          setStartDate(dayjs(target, 'YYYY-M-D').format('YYYY-M-D'))
          setEndDate(dayjs(target, 'YYYY-M-D').format('YYYY-M-D'))
          setNextToSelect('end')

          return
        }

        if (
          nextToSelect === 'end' &&
          startDate !== null &&
          dayjs(startDate).isAfter(dayjs(target, 'YYYY-M-D'))
        ) {
          setStartDate(dayjs(target, 'YYYY-M-D').format('YYYY-M-D'))
          setEndDate(dayjs(startDate).format('YYYY-M-D'))
          setNextToSelect('end')

          return
        }

        setEndDate(dayjs(target, 'YYYY-M-D').format('YYYY-M-D'))
        setNextToSelect('start')
      }}
    >
      <span>{actualIndex}</span>
      {!(firstDay > index || index - firstDay + 1 > lastDate) &&
        transactionCount.total > 0 && (
          <div
            className={clsx(
              'absolute top-1/2 left-1/2 z-[-1] flex size-10 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-sm',
              getTransactionClassName(transactionCount.count)
            )}
          >
            {(
              [
                ['income', 'bg-green-500'],
                ['expenses', 'bg-red-500'],
                ['transfer', 'bg-blue-500']
              ] as const
            ).map(([type, color]) => (
              <span
                key={type}
                className={clsx(color, 'w-full')}
                style={{
                  height: `${Math.round(
                    (transactionCount[type] / transactionCount.total) * 100
                  )}%`
                }}
              ></span>
            ))}
          </div>
        )}
    </button>
  )
}

export default MiniCalendarDateItem
