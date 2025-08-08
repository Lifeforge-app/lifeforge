import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

function DetailItem({
  icon,
  label,
  vertical = false,
  children
}: {
  icon: string
  label: string
  vertical?: boolean
  children: React.ReactElement
}) {
  const { t } = useTranslation('apps.wallet')

  return (
    <div
      className={clsx(
        'bg-bg-50/50 dark:bg-bg-800/50 shadow-custom rounded-lg p-4 w-full min-w-0',
        vertical ? 'space-y-4' : 'space-y-4 sm:space-y-0 sm:flex-between gap-6'
      )}
    >
      <div className="text-bg-500 min-w-0 flex items-center gap-3">
        <Icon className="size-6 shrink-0" icon={icon} />
        <h3 className="w-full min-w-0 truncate text-lg font-medium">
          {t(`inputs.${label}`)}
        </h3>
      </div>
      {children}
    </div>
  )
}

export default DetailItem
