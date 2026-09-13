import dayjs from 'dayjs'
import { useMemo } from 'react'

import { Box, Text } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

import {
  betweenBorderAfter,
  selectedBorderAfter,
  selectedBorderAfterEnd,
  selectedBorderAfterSingle,
  selectedBorderAfterStart,
  transactionBar
} from './MiniCalendarDateItem.css'

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
  const { startDate, endDate, setFilters } = useFilter()

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
    const formattedDate = dayjs(
      `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
      'YYYY-M-D'
    )

    if (startDate && dayjs(startDate).isSame(formattedDate, 'day'))
      return 'first'
    if (endDate && dayjs(endDate).isSame(formattedDate, 'day')) return 'last'

    return ''
  }, [startDate, endDate, date, actualIndex])

  const isBetweenFirstAndLastDay = useMemo(() => {
    if (startDate === '' || endDate === '') return false

    const formattedDate = dayjs(
      `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
      'YYYY-M-D'
    )

    return (
      dayjs(startDate).isBefore(formattedDate, 'day') &&
      dayjs(endDate).isAfter(formattedDate, 'day')
    )
  }, [startDate, endDate, date, actualIndex])

  const isHidden = firstDay > index || index - firstDay + 1 > lastDate

  const getSelectedClass = () => {
    if (isHidden) return ''

    if (isFirstAndLastDay === 'first') {
      const isSingle =
        startDate && endDate && dayjs(startDate).isSame(dayjs(endDate), 'day')

      return `${selectedBorderAfter} ${isSingle ? selectedBorderAfterSingle : selectedBorderAfterStart}`
    }

    if (isFirstAndLastDay === 'last') {
      return `${selectedBorderAfter} ${selectedBorderAfterEnd}`
    }

    if (isBetweenFirstAndLastDay) {
      return betweenBorderAfter
    }

    return ''
  }

  const getOpacityClass = (count: number) => {
    if (count >= 7) return '70%'
    if (count >= 5) return '50%'
    if (count >= 3) return '30%'
    if (count >= 1) return '10%'

    return '0%'
  }

  const handleClick = () => {
    const target = `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`

    if (nextToSelect === 'start') {
      setFilters({
        startDate: dayjs(target, 'YYYY-M-D').format('YYYY-M-D'),
        endDate: dayjs(target, 'YYYY-M-D').format('YYYY-M-D')
      })
      setNextToSelect('end')

      return
    }

    if (
      nextToSelect === 'end' &&
      startDate !== '' &&
      dayjs(startDate).isAfter(dayjs(target, 'YYYY-M-D'))
    ) {
      setFilters({
        startDate: dayjs(target, 'YYYY-M-D').format('YYYY-M-D'),
        endDate: dayjs(startDate).format('YYYY-M-D')
      })
      setNextToSelect('end')

      return
    }

    setFilters({
      endDate: dayjs(target, 'YYYY-M-D').format('YYYY-M-D')
    })
    setNextToSelect('start')
  }

  return (
    <Box
      as="button"
      className={getSelectedClass()}
      height="2.5rem"
      position="relative"
      onClick={handleClick}
    >
      <Text
        align="center"
        color={isHidden ? { base: 'bg-300', dark: 'bg-600' } : undefined}
        size="sm"
        style={isHidden ? { pointerEvents: 'none' } : undefined}
      >
        {actualIndex}
      </Text>
      {!isHidden && transactionCount.total > 0 && (
        <Box
          className={transactionBar}
          style={{
            opacity: getOpacityClass(transactionCount.count)
          }}
        >
          {(
            [
              ['income', 'green-500'],
              ['expenses', 'red-500'],
              ['transfer', 'blue-500']
            ] as const
          ).map(([type, color]) => (
            <Box
              key={type}
              bg={color}
              style={{
                height: `${Math.round(
                  (transactionCount[type] / transactionCount.total) * 100
                )}%`
              }}
              width="100%"
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default MiniCalendarDateItem
