import dayjs from 'dayjs'
import { useCallback } from 'react'
import type { NavigateAction } from 'react-big-calendar'

import { Flex, Text, colorWithOpacity, useModalStore } from '@lifeforge/ui'

import YearMonthSelector from '@/components/modals/YearMonthSelector'

function DateRangeLabel({
  label,
  onNavigate
}: {
  label: string
  onNavigate?: (direction: NavigateAction, date?: Date) => void
}) {
  const { open } = useModalStore()

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
    const shortLabel = label.split(' ')[0].split('').slice(0, 3).join('')

    return (
      <Flex
        align="end"
        as="button"
        bg={{ hover: 'bg-200', darkHover: colorWithOpacity('bg-800', '50%') }}
        gap="sm"
        minWidth="0"
        px="sm"
        py="sm"
        r="md"
        style={{ transition: 'all 150ms ease' }}
        onClick={handleOpenYearMonthSelector}
      >
        <Text truncate display={{ base: 'none', sm: 'inline' }}>
          {label.split(' ')[0]}
        </Text>
        <Text truncate display={{ base: 'inline', sm: 'none' }}>
          {shortLabel}
        </Text>
        <Text color="muted">{label.split(' ')[1]}</Text>
      </Flex>
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
      <Text as="span">
        {start}
        <Text as="span" color="muted">
          {' '}
          - {end}
        </Text>
      </Text>
    )
  }

  return label
}

export default DateRangeLabel
