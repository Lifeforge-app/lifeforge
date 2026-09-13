import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useCallback, useMemo } from 'react'

import { Flex, Text } from '@lifeforge/ui'

import type { CalendarCategory, CalendarEvent } from '@/components/Calendar'
import { useInternalCategories } from '@/hooks/useInternalCategories'
import { forgeAPI } from '@/manifest'

import * as styles from './MiniCalendarDateItem.css'
import MiniCalendarEventDetails from './MiniCalendarEventDetails'
import MiniCalendarEventIndicator from './MiniCalendarEventIndicator'

dayjs.extend(isBetween)

interface MiniCalendarDateItemProps {
  index: number
  actualIndex: number
  firstDay: number
  lastDate: number
  date: Date
  events: CalendarEvent[]
}

function MiniCalendarDateItem({
  index,
  actualIndex,
  firstDay,
  lastDate,
  date,
  events
}: MiniCalendarDateItemProps) {
  const categoriesQuery = useQuery(forgeAPI.categories.list.queryOptions())
  const calendarsQuery = useQuery(forgeAPI.calendars.list.queryOptions())
  const { map: internalCategoryMap } = useInternalCategories()

  const isInThisMonth = useMemo(
    () => !(firstDay > index || index - firstDay + 1 > lastDate),
    [firstDay, index, lastDate]
  )

  const eventsOnTheDay = useMemo(() => {
    return isInThisMonth
      ? events.filter(event => {
          return dayjs(
            `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
            'YYYY-M-D'
          ).isBetween(
            dayjs(event.start),
            dayjs(event.end).subtract(1, 'second'),
            'day',
            '[]'
          )
        })
      : []
  }, [events, firstDay, index, lastDate, date, actualIndex])

  const isToday = useMemo(
    () =>
      dayjs().isSame(
        dayjs(
          `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
          'YYYY-M-D'
        ),
        'day'
      ) && isInThisMonth,
    [date, firstDay, index, lastDate, actualIndex]
  )

  const getCategory = useCallback(
    (event: CalendarEvent) => {
      return event.category.startsWith('_')
        ? (internalCategoryMap[event.category] as CalendarCategory)
        : categoriesQuery.data?.find(category => category.id === event.category)
    },
    [categoriesQuery.data, internalCategoryMap]
  )

  const getCalendar = useCallback(
    (event: CalendarEvent) => {
      return calendarsQuery.data?.find(
        calendar => calendar.id === event.calendar
      )
    },
    [calendarsQuery.data]
  )

  return (
    <>
      <Flex
        key={index}
        centered
        aspectRatio="1/1"
        className={isToday ? styles.today : undefined}
        data-tooltip-id={`calendar-tooltip-${index}`}
        direction="column"
        gap="xs"
        height="100%"
        minHeight="0"
        position="relative"
        style={{ isolation: 'isolate' }}
        width="auto"
      >
        <Text
          color={
            !isInThisMonth ? { base: 'bg-300', dark: 'bg-600' } : undefined
          }
          size="sm"
        >
          {actualIndex}
        </Text>
        {isInThisMonth && eventsOnTheDay.length > 0 && (
          <MiniCalendarEventIndicator
            eventsOnTheDay={eventsOnTheDay}
            getCalendar={getCalendar}
            getCategory={getCategory}
          />
        )}
      </Flex>
      {eventsOnTheDay.length > 0 && (
        <MiniCalendarEventDetails
          actualIndex={actualIndex}
          date={date}
          eventsOnTheDay={eventsOnTheDay}
          getCalendar={getCalendar}
          getCategory={getCategory}
          index={index}
        />
      )}
    </>
  )
}

export default MiniCalendarDateItem
