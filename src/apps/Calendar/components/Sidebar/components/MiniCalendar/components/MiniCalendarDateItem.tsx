import clsx from 'clsx'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../../../../interfaces/calendar_interfaces'

interface MiniCalendarDateItemProps {
  index: number
  actualIndex: number
  firstDay: number
  lastDate: number
  date: Date
  events: ICalendarEvent[]
  categories: ICalendarCategory[]
}

function MiniCalendarDateItem({
  index,
  actualIndex,
  firstDay,
  lastDate,
  date,
  events,
  categories
}: MiniCalendarDateItemProps) {
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

  return (
    <div
      key={index}
      className={clsx(
        'relative isolate flex flex-col items-center gap-1 text-sm',
        !isInThisMonth && 'text-bg-300 dark:text-bg-600',
        isToday &&
          "after:border-custom-500 after:bg-custom-500/10 font-semibold after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:size-10 after:-translate-x-1/2 after:-translate-y-5 after:rounded-md after:border after:content-['']"
      )}
    >
      <span>{actualIndex}</span>
      {isInThisMonth && eventsOnTheDay.length > 0 && (
        <div className="flex w-full items-center justify-center gap-px">
          {eventsOnTheDay.slice(0, 3).map(event => (
            <div
              key={event.id}
              className="size-1 rounded-full"
              style={{
                backgroundColor:
                  typeof categories !== 'string'
                    ? categories.find(
                        category => category.id === event.category
                      )?.color
                    : ''
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MiniCalendarDateItem
