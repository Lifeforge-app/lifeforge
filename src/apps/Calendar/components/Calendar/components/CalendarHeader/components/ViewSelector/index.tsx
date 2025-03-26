import clsx from 'clsx'
import { memo } from 'react'
import { View } from 'react-big-calendar'

import useComponentBg from '@hooks/useComponentBg'

import ChangeViewButton from './components/ChangeViewButton'

function ViewSelector({
  currentView,
  onView
}: {
  currentView: View
  onView: (view: View) => void
}) {
  const { componentBg } = useComponentBg()

  return (
    <div
      className={clsx(
        'shadow-custom flex w-full gap-1 rounded-md p-2',
        componentBg
      )}
    >
      {['Month', 'Week', 'Day', 'Agenda'].map(view => (
        <ChangeViewButton
          key={view}
          currentView={currentView}
          view={view}
          onView={onView}
        />
      ))}
    </div>
  )
}

export default memo(ViewSelector)
