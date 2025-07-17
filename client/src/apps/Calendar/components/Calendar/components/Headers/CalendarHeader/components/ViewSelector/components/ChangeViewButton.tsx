import clsx from 'clsx'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

function ChangeViewButton({
  view,
  currentView,
  onView
}: {
  view: string
  currentView: string
  onView: (view: 'month' | 'week' | 'day' | 'agenda' | 'work_week') => void
}) {
  const { t } = useTranslation('apps.calendar')

  return (
    <button
      key={view}
      className={clsx(
        'hover:bg-bg-100 dark:hover:bg-bg-800 w-full truncate rounded-md p-3 px-4 font-medium whitespace-nowrap transition-all',
        view.toLowerCase() === currentView
          ? 'bg-bg-200/50 text-bg-800 dark:bg-bg-800 dark:text-bg-200 font-medium shadow-xs'
          : 'text-bg-500'
      )}
      onClick={() => {
        onView(view.toLowerCase() as 'month' | 'week' | 'day' | 'agenda')
      }}
    >
      {t(`view.${_.camelCase(view)}`)}
    </button>
  )
}

export default ChangeViewButton
