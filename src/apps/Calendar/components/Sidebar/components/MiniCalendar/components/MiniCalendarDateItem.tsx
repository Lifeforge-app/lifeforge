import clsx from 'clsx'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Tooltip } from 'react-tooltip'

import { INTERNAL_CATEGORIES } from '@apps/Calendar/constants/internalCategories'

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

  function getBgColor(event: ICalendarEvent) {
    return event.category.startsWith('_')
      ? INTERNAL_CATEGORIES[event.category as keyof typeof INTERNAL_CATEGORIES]
          .color
      : categories.find(category => category.id === event.category)?.color
  }

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
        {isInThisMonth &&
          eventsOnTheDay.length > 0 &&
          (() => {
            const groupedByThree = []

            for (let i = 0; i < eventsOnTheDay.length; i += 3) {
              groupedByThree.push(eventsOnTheDay.slice(i, i + 3))
            }
            return (
              <div className="space-y-px">
                {groupedByThree.map(group => (
                  <div key={`group-${group[0].id}`} className="flex gap-px">
                    {group.map(event => {
                      const backgroundColor = getBgColor(event)

                      return (
                        <div
                          key={event.id}
                          className="size-1 rounded-full"
                          style={{
                            backgroundColor: backgroundColor ?? ''
                          }}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            )
          })()}
      </div>
      {eventsOnTheDay.length > 0 && (
        <Tooltip
          clickable
          noArrow
          className="bg-bg-50! text-bg-800! shadow-custom border-bg-200 dark:border-bg-700 dark:bg-bg-800! bg-opacity-0! dark:text-bg-50 z-[9999]! rounded-md! border p-4! text-base!"
          id={`calendar-tooltip-${index}`}
          opacity={1}
          place="bottom"
          positionStrategy="fixed"
        >
          <div className="relative max-h-96 max-w-96 min-w-64 overflow-y-auto">
            <div className="flex items-start justify-between gap-8">
              <div>
                <h3 className="text-bg-800 dark:text-bg-100 text-xl font-semibold">
                  {dayjs(
                    `${date.getFullYear()}-${date.getMonth() + 1}-${actualIndex}`,
                    'YYYY-M-D'
                  ).format('dddd, MMMM D')}
                </h3>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {eventsOnTheDay.map(event => {
                const backgroundColor = getBgColor(event)

                return (
                  <p
                    key={event.id}
                    className="text-bg-500 relative pl-4 before:absolute before:top-1/2 before:left-0 before:h-full before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-[var(--bg-color)]"
                    style={{
                      // @ts-expect-error - CSS variable
                      '--bg-color': backgroundColor ?? ''
                    }}
                  >
                    {event.title}
                  </p>
                )
              })}
            </div>
          </div>
        </Tooltip>
      )}
    </>
  )
}

export default MiniCalendarDateItem
