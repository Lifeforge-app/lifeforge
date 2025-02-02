import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

function ChangeViewButton({
  view,
  currentView,
  onView
}: {
  view: string
  currentView: string
  onView: (view: 'month' | 'week' | 'day' | 'agenda' | 'work_week') => void
}): React.ReactElement {
  const { t } = useTranslation('modules.calendar')

  return (
    <button
      key={view}
      className={`w-full whitespace-nowrap rounded-md p-2 px-4 transition-all hover:bg-bg-100 dark:hover:bg-bg-800 ${
        view.toLowerCase() === currentView
          ? 'bg-bg-200/50 font-medium text-bg-800 shadow-xs dark:bg-bg-800 dark:text-bg-200'
          : 'text-bg-500'
      }`}
      onClick={() => {
        onView(view.toLowerCase() as 'month' | 'week' | 'day' | 'agenda')
      }}
    >
      {t(`view.${toCamelCase(view)}`)}
    </button>
  )
}

export default ChangeViewButton
