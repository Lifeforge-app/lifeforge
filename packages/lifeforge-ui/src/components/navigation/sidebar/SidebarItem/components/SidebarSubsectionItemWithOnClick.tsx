import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useModuleSidebarState } from '@components/layout'

function SidebarSubsectionItemWithOnClick({
  subsectionLabel,
  icon,
  label,
  active,
  onClick,
  amount,
  namespace
}: {
  subsectionLabel: string
  icon: string | React.ReactElement
  label: string | React.ReactElement
  active?: boolean
  onClick: () => void
  amount?: number
  namespace?: string | false
}) {
  const { setIsSidebarOpen } = useModuleSidebarState()

  const { t } = useTranslation(
    namespace
      ? [namespace, 'common.sidebar']
      : namespace === false
        ? []
        : 'common.sidebar'
  )

  const handleClick = useCallback(() => {
    setIsSidebarOpen(false)
    onClick()
  }, [])

  return (
    <button
      key={subsectionLabel}
      className={clsx(
        'hover:bg-bg-200/30 dark:hover:bg-bg-800/30 mx-4 flex h-14 w-full items-center gap-3 rounded-lg! pl-12 text-left font-medium transition-all',
        active
          ? 'bg-bg-200/50 hover:bg-bg-200/50! shadow-custom dark:bg-bg-800 dark:hover:bg-bg-800!'
          : 'text-bg-500'
      )}
      onClick={handleClick}
    >
      <div className="flex size-7 items-center justify-center">
        {typeof icon === 'string' ? (
          <Icon className="size-6" icon={icon} />
        ) : (
          icon
        )}
      </div>
      <span className="w-full truncate pr-4">
        {namespace !== false
          ? t([
              `apps.${_.camelCase(label.toString())}.subsections.${_.camelCase(
                subsectionLabel
              )}`,
              subsectionLabel
            ])
          : subsectionLabel}
      </span>
      {amount !== undefined && (
        <span className="mr-5 ml-auto flex items-center gap-1">
          <span className="text-bg-500 text-sm font-medium">{amount}</span>
        </span>
      )}
    </button>
  )
}

export default SidebarSubsectionItemWithOnClick
