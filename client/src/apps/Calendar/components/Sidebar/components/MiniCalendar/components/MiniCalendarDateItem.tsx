import clsx from 'clsx'
import dayjs from 'dayjs'
import { useCallback, useMemo } from 'react'

import { useAPIQuery } from 'shared/lib'

import { INTERNAL_CATEGORIES } from '@apps/Calendar/constants/internalCategories'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../../../../interfaces/calendar_interfaces'
import MiniCalendarEventDetails from './MiniCalendarEventDetails'
import MiniCalendarEventIndicator from './MiniCalendarEventIndicator'

interface MiniCalendarDateItemProps {
  index: number
  actualIndex: number
  firstDay: number
  lastDate: number
  date: Date
  events: ICalendarEvent[]
}

function MiniCalendarDateItem({
  index,
  actualIndex,
  firstDay,
  lastDate,
  date,
  events
}: MiniCalendarDateItemProps) {
  const categoriesQuery = useAPIQuery<ICalendarCategory[]>(
    'calendar/categories',
    ['calendar', 'categories']
  )

  const isInThisMonth = useMemo(
    () => !(firstDay > index || index - firstDay + 1 > lastDate),
    [firstDay, index, lastDate]
  )

  const eventsOnTheDay = useMemo<ICalendarEvent[]>(() => {
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
    (event: ICalendarEvent): ICalendarCategory | undefined => {
      return event.category.startsWith('_')
        ? (INTERNAL_CATEGORIES[
            event.category as keyof typeof INTERNAL_CATEGORIES
          ] as ICalendarCategory)
        : categoriesQuery.data?.find(category => category.id === event.category)
    },
    [categoriesQuery.data]
  )

  return (
    <>
      <div
        key={index}
        className={clsx(
          'relative isolate flex flex-col items-center gap-1 text-sm',
          !isInThisMonth && 'text-bg-300 dark:text-bg-600',
          isToday &&
            "after:border-custom-500 after:bg-custom-500/10 font-semibold after:absolute after:top-1/2 after:left-1/2 after:z-[-1] after:size-10 after:-translate-x-1/2 after:-translate-y-5 after:rounded-md after:border after:content-['']"
        )}
        data-tooltip-id={`calendar-tooltip-${index}`}
      >
        <span>{actualIndex}</span>
        {isInThisMonth && eventsOnTheDay.length > 0 && (
          <MiniCalendarEventIndicator
            eventsOnTheDay={eventsOnTheDay}
            getCategory={getCategory}
          />
        )}
      </div>
      {eventsOnTheDay.length > 0 && (
        <MiniCalendarEventDetails
          actualIndex={actualIndex}
          date={date}
          eventsOnTheDay={eventsOnTheDay}
          getCategory={getCategory}
          index={index}
        />
      )}
    </>
  )
}

export default MiniCalendarDateItem
