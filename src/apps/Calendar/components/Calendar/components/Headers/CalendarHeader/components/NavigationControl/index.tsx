import { memo } from 'react'
import { NavigateAction } from 'react-big-calendar'

import { Button } from '@lifeforge/ui'

import DateRangeLabel from './components/DateRangeLabel'

function NavigationControl({
  label,
  onNavigate
}: {
  label: string
  onNavigate: (direction: NavigateAction) => void
}) {
  return (
    <div className="flex w-full items-center gap-4">
      <div className="flex-between flex w-full gap-2 md:w-auto md:justify-start md:gap-0">
        <Button
          icon="tabler:chevron-left"
          variant="plain"
          onClick={() => {
            onNavigate('PREV')
          }}
        />
        <div className="flex shrink-0 gap-2 text-center text-2xl font-bold md:hidden">
          <DateRangeLabel label={label} />
        </div>
        <Button
          icon="tabler:chevron-right"
          variant="plain"
          onClick={() => {
            onNavigate('NEXT')
          }}
        />
      </div>
      <div className="hidden shrink-0 items-end gap-2 text-center text-2xl font-medium md:flex">
        <DateRangeLabel label={label} />
      </div>
    </div>
  )
}

export default memo(NavigationControl)
