import { memo } from 'react'
import { createPortal } from 'react-dom'
import { Tooltip } from 'react-tooltip'

import { Box, useMainSidebarState } from '@lifeforge/ui'

import { type CalendarCategory, type CalendarEvent } from '../../../index.js'
import EventDetails from '../../EventDetails/index.js'

function EventItemTooltip({
  event,
  category
}: {
  event: CalendarEvent
  category: CalendarCategory | undefined
}) {
  const { sidebarExpanded } = useMainSidebarState()

  return createPortal(
    <Box
      asChild
      shadow
      bg={{ base: 'bg-50', dark: 'bg-800' }}
      r="md"
      zIndex={{ base: sidebarExpanded ? '-1' : '0', lg: '0' }}
    >
      <Tooltip
        clickable
        noArrow
        openOnClick
        id={`calendar-event-${event.id}`}
        opacity={1}
        place="bottom-end"
        positionStrategy="fixed"
      >
        <Box
          maxHeight="24rem"
          maxWidth="24rem"
          minWidth="16rem"
          overflowY="auto"
          position="relative"
          style={{ whiteSpace: 'normal' }}
        >
          <EventDetails category={category} event={event} />
        </Box>
      </Tooltip>
    </Box>,
    document.getElementById('app') ?? document.body
  ) as React.ReactPortal
}

export default memo(EventItemTooltip)
