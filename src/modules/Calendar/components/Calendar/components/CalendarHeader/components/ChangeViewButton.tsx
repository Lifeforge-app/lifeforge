import React from 'react'

function ChangeViewButton({
  view,
  currentView,
  onView
}: {
  view: string
  currentView: string
  onView: (view: 'month' | 'week' | 'day' | 'agenda' | 'work_week') => void
}): React.ReactElement {
  return (
    <button
      key={view}
      onClick={() => {
        onView(view.toLowerCase() as 'month' | 'week' | 'day' | 'agenda')
      }}
      className={`rounded-md p-2 px-4 transition-all hover:bg-bg-800 ${
        view.toLowerCase() === currentView
          ? 'bg-bg-800 text-bg-200'
          : 'text-bg-500'
      }`}
    >
      {view}
    </button>
  )
}

export default ChangeViewButton
