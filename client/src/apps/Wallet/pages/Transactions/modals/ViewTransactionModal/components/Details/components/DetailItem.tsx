import { Icon } from '@iconify/react/dist/iconify.js'
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
        'component-bg-lighter rounded-lg p-4',
        vertical ? 'space-y-4' : 'flex-between'
      )}
    >
      <div className="text-bg-500 flex items-center gap-3">
        <Icon className="size-6" icon={icon} />
        <h3 className="text-lg font-medium">{t(`inputs.${name}`)}</h3>
      </div>
      {children}
    </div>
  )
}

export default DetailItem
