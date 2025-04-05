import { memo, useMemo } from 'react'
import { NavigateAction } from 'react-big-calendar'

import { Button } from '@lifeforge/ui'

import NavigationButton from './components/NavigationButton'

const MONTHS_ABBR = {
  January: 'Jan',
  February: 'Feb',
  March: 'Mar',
  April: 'Apr',
  May: 'May',
  June: 'Jun',
  July: 'Jul',
  August: 'Aug',
  September: 'Sep',
  October: 'Oct',
  November: 'Nov',
  December: 'Dec'
}

function NavigationControl({
  label,
  onNavigate
}: {
  label: string
  onNavigate: (direction: NavigateAction) => void
}) {
  const finalLabel = useMemo(() => {
    let newLabel = label
    Object.keys(MONTHS_ABBR).forEach(month => {
      newLabel = newLabel.replace(
        month,
        MONTHS_ABBR[month as keyof typeof MONTHS_ABBR]
      )
    })
    return newLabel
  }, [label])

  return (
    <div className="flex w-full items-center gap-4">
      <div className="flex-between flex w-full gap-2 lg:w-auto lg:justify-start lg:gap-0">
        <Button
          icon="tabler:chevron-left"
          onClick={() => {
            onNavigate('PREV')
          }}
          variant="plain"
        />
        <div className="block text-center text-2xl font-bold lg:hidden">
          {finalLabel}
        </div>
        <Button
          icon="tabler:chevron-right"
          onClick={() => {
            onNavigate('NEXT')
          }}
          variant="plain"
        />
      </div>
      <div className="hidden text-center text-2xl font-bold lg:block">
        {finalLabel}
      </div>
    </div>
  )
}

export default memo(NavigationControl)
