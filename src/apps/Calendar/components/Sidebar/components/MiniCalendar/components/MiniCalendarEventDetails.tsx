import dayjs from 'dayjs'
import { createPortal } from 'react-dom'
import { Tooltip } from 'react-tooltip'

import { ICalendarEvent } from '@apps/Calendar/interfaces/calendar_interfaces'

function MiniCalendarEventDetails({
  index,
  actualIndex,
  date,
  eventsOnTheDay,
  getBgColor
}: {
  index: number
  actualIndex: number
  date: Date
  eventsOnTheDay: ICalendarEvent[]
  getBgColor: (event: ICalendarEvent) => string | undefined
}) {
  return createPortal(
    <Tooltip
      noArrow
      className="bg-bg-50! text-bg-800! shadow-custom border-bg-200 dark:border-bg-700 dark:bg-bg-800! bg-opacity-0! dark:text-bg-50 z-[9999]! rounded-md! border p-4! text-base!"
      id={`calendar-tooltip-${index}`}
      opacity={1}
      place="bottom"
      positionStrategy="absolute"
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
    </Tooltip>,
    document.body
  )
}

export default MiniCalendarEventDetails
