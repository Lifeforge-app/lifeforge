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
        'hover:bg-bg-100 dark:hover:bg-bg-800 w-full whitespace-nowrap rounded-md p-2 px-4 transition-all',
        view.toLowerCase() === currentView
          ? 'bg-bg-200/50 text-bg-800 dark:bg-bg-800 dark:text-bg-200 shadow-xs font-medium'
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
