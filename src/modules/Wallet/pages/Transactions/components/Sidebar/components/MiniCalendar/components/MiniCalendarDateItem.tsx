import clsx from 'clsx'
import moment from 'moment'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { useWalletContext } from '@providers/WalletProvider'

interface MiniCalendarDateItemProps {
  index: number
  actualIndex: number
  firstDay: number
  lastDate: number
  date: Date
  nextToSelect: 'start' | 'end'
  setNextToSelect: React.Dispatch<React.SetStateAction<'start' | 'end'>>
  viewsFilter: ('income' | 'expenses' | 'transfer')[]
}

const getDayClassName = ({
  index,
  firstDay,
  lastDate,
  searchParams,
  isFirstAndLastDay,
  isBetweenFirstAndLastDay
}: {
  index: number
  firstDay: number
  lastDate: number
  searchParams: URLSearchParams
  isFirstAndLastDay: string
  isBetweenFirstAndLastDay: boolean
}) => {
  if (firstDay > index || index - firstDay + 1 > lastDate) {
    return 'pointer-events-none text-bg-300 dark:text-bg-600'
  }

  if (
    firstDay <= index &&
    index - firstDay + 1 <= lastDate &&
    (searchParams.get('start_date') !== null ||
      searchParams.get('end_date') !== null)
  ) {
    if (isFirstAndLastDay !== '') {
      const isSingleDate = moment(searchParams.get('start_date')).isSame(
        moment(searchParams.get('end_date') ?? moment().format('YYYY-MM-DD')),
        'day'
      )

      const borderClassName =
        isFirstAndLastDay === 'first'
          ? 'after:rounded-l-md after:border-y after:border-l'
          : 'after:rounded-r-md after:border-y after:border-r'

      return `font-semibold after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:h-12 after:w-full after:-translate-x-1/2 after:-translate-y-1/2 after:border-custom-500 after:content-[''] ${
        isSingleDate ? 'after:rounded-md after:border' : borderClassName
      }`
    }

    if (isBetweenFirstAndLastDay) {
      return "after:absolute after:left-1/2 after:top-1/2 after:z-[-2] after:h-12 after:w-full after:-translate-x-1/2 after:-translate-y-1/2 after:border-y after:border-custom-500 after:content-['']"
    }
  }

  return 'cursor-pointer'
}

const getTransactionClassName = (transactionCount: number): string => {
  let opacityClass = ''

  if (transactionCount >= 7) {
    opacityClass = 'opacity-70'
  } else if (transactionCount >= 5) {
    opacityClass = 'opacity-50'
  } else if (transactionCount >= 3) {
    opacityClass = 'opacity-30'
  } else if (transactionCount >= 1) {
    opacityClass = 'opacity-10'
  }

  return `absolute left-1/2 top-1/2 z-[-1] flex size-10 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md ${opacityClass}`
}

function MiniCalendarDateItem({
  index,
  actualIndex,
  firstDay,
  lastDate,
  date,
  nextToSelect,
  setNextToSelect,
  viewsFilter
}: MiniCalendarDateItemProps): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const { transactions } = useWalletContext()

  const transactionCount = useMemo<{
    income: number
    expenses: number
    transfer: number
    total: number
    count: number
  }>(() => {
    if (typeof transactions === 'string') {
      return {
        income: 0,
        expenses: 0,
        transfer: 0,
        total: 0,
        count: 0
      }
    }

    const relatedTransactions = transactions.filter(transaction => {
      const transactionDate = moment(transaction.date, 'YYYY-MM-DD')
      const targetDate = moment(
        `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
        'YYYY-M-DD'
      )

      return (
        transactionDate.isSame(targetDate, 'day') &&
        transactionDate.isSame(targetDate, 'month') &&
        transactionDate.isSame(targetDate, 'year')
      )
    })

    return relatedTransactions.reduce(
      (acc, transaction) => {
        if (!viewsFilter.includes(transaction.type)) {
          return acc
        }

        if (transaction.type === 'income') {
          acc.income += transaction.amount
        } else if (transaction.type === 'expenses') {
          acc.expenses += transaction.amount
        } else if (transaction.type === 'transfer') {
          acc.transfer += transaction.amount / 2
        }

        acc.total +=
          transaction.amount / (transaction.type === 'transfer' ? 2 : 1)
        acc.count += 1 / (transaction.type === 'transfer' ? 2 : 1)

        return acc
      },
      { income: 0, expenses: 0, transfer: 0, total: 0, count: 0 }
    )
  }, [transactions, date, actualIndex])

  const isFirstAndLastDay = useMemo(() => {
    const startDateParam = searchParams.get('start_date')
    const endDateParam = searchParams.get('end_date')
    const formattedDate = moment(
      `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
      'YYYY-M-DD'
    )

    if (startDateParam && moment(startDateParam).isSame(formattedDate, 'day')) {
      return 'first'
    }

    if (endDateParam && moment(endDateParam).isSame(formattedDate, 'day')) {
      return 'last'
    }

    return ''
  }, [searchParams, date, actualIndex])

  const isBetweenFirstAndLastDay = useMemo(() => {
    if (
      searchParams.get('start_date') === null ||
      searchParams.get('end_date') === null
    ) {
      return false
    }

    return (
      moment(
        searchParams.get('start_date') ?? moment().format('YYYY-MM-DD')
      ).isBefore(
        moment(
          `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
          'YYYY-M-DD'
        ),
        'day'
      ) &&
      moment(
        searchParams.get('end_date') ?? moment().format('YYYY-MM-DD')
      ).isAfter(
        moment(
          `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
          'YYYY-M-DD'
        ),
        'day'
      )
    )
  }, [searchParams, date, actualIndex])

  return (
    <button
      key={index}
      className={clsx(
        'relative h-10',
        getDayClassName({
          index,
          firstDay,
          lastDate,
          searchParams,
          isFirstAndLastDay,
          isBetweenFirstAndLastDay
        })
      )}
      onClick={() => {
        const target = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${actualIndex}`

        searchParams.set(
          `${nextToSelect}_date`,
          moment(target, 'YYYY-MM-DD').format('YYYY-M-DD')
        )

        if (nextToSelect === 'start') {
          searchParams.set(
            'end_date',
            moment(target, 'YYYY-MM-DD').format('YYYY-M-DD')
          )
        }

        if (
          nextToSelect === 'end' &&
          searchParams.get('start_date') !== null &&
          moment(searchParams.get('start_date')).isAfter(
            moment(target, 'YYYY-MM-DD')
          )
        ) {
          searchParams.set(
            'start_date',
            moment(target, 'YYYY-MM-DD').format('YYYY-M-DD')
          )
          searchParams.set(
            'end_date',
            moment(searchParams.get('start_date')).format('YYYY-M-DD')
          )
          setNextToSelect('end')
          setSearchParams(searchParams)
          return
        }

        setNextToSelect(nextToSelect === 'start' ? 'end' : 'start')
        setSearchParams(searchParams)
      }}
    >
      <span>{actualIndex}</span>
      {!(firstDay > index || index - firstDay + 1 > lastDate) &&
        transactionCount.total > 0 && (
          <div
            className={clsx(
              'absolute top-1/2 left-1/2 z-[-1] flex size-10 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md',
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
