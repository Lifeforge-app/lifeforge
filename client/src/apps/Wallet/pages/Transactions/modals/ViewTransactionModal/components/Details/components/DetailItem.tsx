import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

function DetailItem({
  icon,
  name,
  vertical = false,
  children
}: {
  icon: string
  name: string
  vertical?: boolean
  children: React.ReactElement
}) {
  const { t } = useTranslation('apps.wallet')

  return (
    <div
      className={clsx(
        'bg-bg-50/50 dark:bg-bg-800/50 shadow-custom rounded-lg p-4',
        vertical ? 'space-y-4' : 'flex-between gap-6'
      )}
    >
      <div className="text-bg-500 flex items-center gap-3">
        <Icon className="size-6 shrink-0" icon={icon} />
        <h3 className="text-lg font-medium whitespace-nowrap">
          {t(`inputs.${name}`)}
        </h3>
      </div>
      {children}
    </div>
  )
}

export default DetailItem
