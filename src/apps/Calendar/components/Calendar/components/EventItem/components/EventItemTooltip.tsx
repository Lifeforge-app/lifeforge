import { useSidebarState } from '@providers/SidebarStateProvider.tsx'
import clsx from 'clsx'
import { memo } from 'react'
import { createPortal } from 'react-dom'
import { Tooltip } from 'react-tooltip'

import {
  ICalendarCategory,
  ICalendarEvent
} from '@apps/Calendar/interfaces/calendar_interfaces.ts'

import EventDetails from '../../EventDetails.tsx'

function EventItemTooltip({
  event,
  category
}: {
  event: ICalendarEvent
  category: ICalendarCategory | undefined
}) {
  const { sidebarExpanded } = useSidebarState()

  return createPortal(
    <Tooltip
      clickable
      noArrow
      openOnClick
      className={clsx(
        'bg-bg-50! text-bg-800! border-bg-200 dark:border-bg-700 shadow-custom dark:bg-bg-800! bg-opacity-0! dark:text-bg-50 rounded-md! border p-4! text-base!',
        sidebarExpanded ? 'z-[-1] lg:z-0' : 'z-0'
      )}
      id={`calendar-event-${event.id}`}
      opacity={1}
      place="bottom-end"
      positionStrategy="fixed"
    >
      <div className="relative max-h-96 max-w-96 min-w-64 overflow-y-auto whitespace-normal">
        <EventDetails category={category} event={event} />
      </div>
    </Tooltip>,
    document.getElementById('app') ?? document.body
  ) as React.ReactPortal
}

export default memo(EventItemTooltip)
