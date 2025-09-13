import { Icon } from '@iconify/react/dist/iconify.js'
import { Button } from 'lifeforge-ui'
import { memo } from 'react'
import type { NavigateAction } from 'react-big-calendar'

import { useCalendarStore } from '@apps/01.Productivity/calendar/stores/useCalendarStore'

import DateRangeLabel from './components/DateRangeLabel'

function NavigationControl({
  label,
  onNavigate
}: {
  label: string
  onNavigate: (direction: NavigateAction) => void
}) {
  const { isEventLoading } = useCalendarStore()

  return (
    <div className="flex w-full items-center gap-3">
      <div className="flex-between flex justify-start gap-0">
        <Button
          icon="tabler:chevron-left"
          variant="plain"
          onClick={() => {
            onNavigate('PREV')
          }}
        />
        <Button
          icon="tabler:chevron-right"
          variant="plain"
          onClick={() => {
            onNavigate('NEXT')
          }}
        />
      </div>
      <div className="flex shrink-0 items-center gap-2 text-center text-2xl font-medium">
        <DateRangeLabel label={label} />
        {isEventLoading && (
          <Icon className="text-bg-500 h-5 w-5" icon="svg-spinners:180-ring" />
        )}
      </div>
    </div>
  )
}

export default memo(NavigationControl)
