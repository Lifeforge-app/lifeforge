import dayjs from 'dayjs'
import { useMemo } from 'react'

import { Flex, Grid, Text, Transition } from '@/components/primitives'
import { colorWithOpacity } from '@/system'

import { useDatePicker } from '../contexts/DatePickerContext'

export function CalendarGrid() {
  const {
    currentYearMonth: currentMonth,
    selectedDate,
    onSelectDate,
    startDate: minDate,
    endDate: maxDate
  } = useDatePicker()

  const days = useMemo(() => {
    const startOfMonth = currentMonth.startOf('month')
    const endOfMonth = currentMonth.endOf('month')
    const startOfGrid = startOfMonth.startOf('week')
    const endOfGrid = endOfMonth.endOf('week')

    const gridDays: dayjs.Dayjs[] = []

    let cursor = startOfGrid

    while (cursor.isBefore(endOfGrid) || cursor.isSame(endOfGrid, 'day')) {
      gridDays.push(cursor)
      cursor = cursor.add(1, 'day')
    }

    return gridDays
  }, [currentMonth])

  const today = useMemo(() => dayjs(), [])

  return (
    <Flex align="center" direction="column" gap="sm" width="100%">
      <Grid gap="xs" maxWidth="30rem" templateCols={7} width="100%">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
          (weekday, index) => {
            return (
              <Flex key={weekday} align="center" justify="center" py="xs">
                <Text
                  align="center"
                  color={index === 0 ? 'dangerous' : 'muted'}
                  display="contents"
                  size="base"
                  weight="medium"
                >
                  <Text display={{ base: 'none', sm: 'block' }}>{weekday}</Text>
                  <Text display={{ base: 'block', sm: 'none' }}>
                    {weekday[0]}
                  </Text>
                </Text>
              </Flex>
            )
          }
        )}
      </Grid>

      <Grid gap="xs" maxWidth="30rem" templateCols={7} width="100%">
        {days.map(day => {
          const isCurrentMonth = day.isSame(currentMonth, 'month')
          const isSelected = selectedDate
            ? day.isSame(selectedDate, 'day')
            : false
          const isToday = day.isSame(today, 'day')
          const isSunday = day.day() === 0

          const isDisabled =
            (minDate !== undefined &&
              day.isBefore(dayjs(minDate).startOf('day'), 'day')) ||
            (maxDate !== undefined &&
              day.isAfter(dayjs(maxDate).endOf('day'), 'day'))

          return (
            <Transition key={day.toISOString()} duration="100ms" property="all">
              <Flex
                align="center"
                aspectRatio="1/1"
                bg={
                  isSelected
                    ? 'custom-500'
                    : isToday
                      ? colorWithOpacity('custom-500', '20%')
                      : {
                          base: 'transparent',
                          hover: isDisabled ? 'transparent' : 'bg-200',
                          darkHover: isDisabled ? 'transparent' : 'bg-700'
                        }
                }
                justify="center"
                r="lg"
                style={{
                  cursor: isDisabled ? 'not-allowed' : 'pointer'
                }}
                width="100%"
                onClick={() => {
                  if (!isDisabled) {
                    onSelectDate(day)
                  }
                }}
              >
                <Text
                  align="center"
                  color={
                    isSelected
                      ? { base: 'bg-50', dark: 'bg-900' }
                      : isToday
                        ? 'custom-500'
                        : isCurrentMonth && !isDisabled
                          ? isSunday
                            ? 'dangerous'
                            : 'bg-500'
                          : colorWithOpacity('bg-500', '30%')
                  }
                  size="base"
                  weight={isSelected || isToday ? 'bold' : 'normal'}
                >
                  {day.date()}
                </Text>
              </Flex>
            </Transition>
          )
        })}
      </Grid>
    </Flex>
  )
}
