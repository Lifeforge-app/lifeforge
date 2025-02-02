import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useThemeColors from '@hooks/useThemeColor'
import { toCamelCase } from '@utils/strings'

function DashboardItem({
  ref,
  className = '',
  icon,
  title,
  children,
  componentBesideTitle,
  namespace = 'modules.dashboard'
}: {
  ref?: React.Ref<any>
  className?: string
  icon: string
  title: string
  children?: React.ReactNode
  componentBesideTitle?: React.ReactNode
  namespace?: string
}): React.ReactElement {
  const { t } = useTranslation(namespace)
  const { componentBg } = useThemeColors()

  return (
    <div
      ref={ref}
      className={`${className} flex size-full flex-col gap-4 rounded-lg p-6 shadow-custom ${componentBg}`}
    >
      <div className="flex-between mb-2 flex">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Icon className="text-2xl" icon={icon} />
          <span className="ml-2">
            {t(`widgets.${toCamelCase(title)}.title`)}
          </span>
        </h2>
        {componentBesideTitle}
      </div>
      {children}
    </div>
  )
}

export default DashboardItem
