import moment from 'moment'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useWalletContext } from '@providers/WalletProvider'

interface MiniCalendarDateItemProps {
  index: number
  actualIndex: number
  firstDay: number
  lastDate: number
  date: Date
  nextToSelect: 'start' | 'end'
  setNextToSelect: React.Dispatch<React.SetStateAction<'start' | 'end'>>
}

function MiniCalendarDateItem({
  index,
  actualIndex,
  firstDay,
  lastDate,
  date,
  nextToSelect,
  setNextToSelect
}: MiniCalendarDateItemProps): React.ReactElement {
  const { transactions } = useWalletContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const transactionCount = useMemo(() => {
    if (typeof transactions === 'string') return 0

    return transactions.filter(transaction => {
      return moment(
        `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
        'YYYY-M-DD'
      ).isSame(moment(transaction.date), 'day')
    }).length
  }, [transactions, date, actualIndex])

  const isFirstAndLastDay = useMemo(() => {
    return searchParams.get('start_date') !== null &&
      moment(searchParams.get('start_date')).isSame(
        moment(
          `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
          'YYYY-M-DD'
        ),
        'day'
      )
      ? 'first'
      : searchParams.get('end_date') !== null &&
        moment(searchParams.get('end_date')).isSame(
          moment(
            `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
            'YYYY-M-DD'
          ),
          'day'
        )
      ? 'last'
      : ''
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
    <div
      key={index}
      onClick={() => {
        setSearchParams(searchParams => {
          const target = `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${actualIndex}`
          searchParams.set(
            `${nextToSelect}_date`,
            moment(target).format('YYYY-MM-DD')
          )
          if (nextToSelect === 'start') {
            searchParams.delete('end_date')
          }
          if (
            nextToSelect === 'end' &&
            searchParams.get('start_date') !== null &&
            moment(searchParams.get('start_date')).isAfter(moment(target))
          ) {
            searchParams.set('start_date', moment(target).format('YYYY-MM-DD'))
            searchParams.delete('end_date')
            setNextToSelect('end')
            return searchParams
          }

          setNextToSelect(nextToSelect === 'start' ? 'end' : 'start')
          return searchParams
        })
      }}
      className={`relative isolate flex flex-col items-center gap-1 text-sm ${
        firstDay > index || index - firstDay + 1 > lastDate
          ? 'pointer-events-none text-bg-300 dark:text-bg-600'
          : 'cursor-pointer'
      } ${
        firstDay <= index &&
        index - firstDay + 1 <= lastDate &&
        (searchParams.get('start_date') !== null ||
        searchParams.get('end_date') !== null
          ? isFirstAndLastDay !== ''
            ? `font-semibold after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:h-9 after:w-10 after:-translate-x-1/2 after:-translate-y-1/2 after:border-custom-500 after:content-[''] ${
                isFirstAndLastDay === 'first'
                  ? 'after:rounded-l-md after:border-y after:border-l'
                  : 'after:rounded-r-md after:border-y after:border-r'
              }`
            : isBetweenFirstAndLastDay
            ? "after:absolute after:left-1/2 after:top-1/2 after:z-[-2] after:h-9 after:w-10 after:-translate-x-1/2 after:-translate-y-1/2 after:border-y after:border-custom-500 after:content-['']"
            : ''
          : '')
      }`}
    >
      <span>{actualIndex}</span>
      {!(firstDay > index || index - firstDay + 1 > lastDate) && (
        <div
          className={`absolute left-1/2 top-1/2 z-[-1] size-8 -translate-x-1/2 -translate-y-1/2 rounded-md ${
            transactionCount >= 7
              ? 'bg-custom-500/70'
              : transactionCount >= 5
              ? 'bg-custom-500/50'
              : transactionCount >= 3
              ? 'bg-custom-500/30'
              : transactionCount >= 1
              ? 'bg-custom-500/10'
              : ''
          }`}
        />
      )}
    </div>
  )
}

export default MiniCalendarDateItem
