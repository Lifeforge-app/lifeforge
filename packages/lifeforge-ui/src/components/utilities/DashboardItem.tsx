import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

function DashboardItem({
  ref,
  className = '',
  icon,
  title,
  children,
  componentBesideTitle,
  namespace = 'core.dashboard'
}: {
  ref?: React.Ref<HTMLDivElement>
  className?: string
  icon: string
  title: string
  children?: React.ReactNode
  componentBesideTitle?: React.ReactNode
  namespace?: string
}) {
  const { t } = useTranslation(namespace)

  return (
    <div
      ref={ref}
      className={clsx(
        'shadow-custom component-bg flex size-full flex-col gap-3 rounded-lg p-6',
        className
      )}
    >
      <div className="mb-2 flex items-start justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Icon className="text-2xl" icon={icon} />
          <span className="ml-2">
            {t([
              `widgets.${_.camelCase(title)}.title`,
              `widgets.${_.camelCase(title)}`,
              title
            ])}
          </span>
        </h2>
        {componentBesideTitle}
      </div>
      {children}
    </div>
  )
}

export default DashboardItem
