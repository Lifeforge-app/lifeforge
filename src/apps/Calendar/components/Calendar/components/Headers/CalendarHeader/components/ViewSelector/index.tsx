import { memo } from 'react'
import { View } from 'react-big-calendar'

import ChangeViewButton from './components/ChangeViewButton'

function ViewSelector({
  currentView,
  onView
}: {
  currentView: View
  onView: (view: View) => void
}) {
  return (
    <div className="shadow-custom component-bg mb-4 flex w-full gap-1 rounded-md p-2">
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
