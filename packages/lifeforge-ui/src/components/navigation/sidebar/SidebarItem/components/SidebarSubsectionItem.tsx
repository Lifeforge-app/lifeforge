import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'shared'
import { useMainSidebarState } from 'shared'

function SidebarSubsectionItem({
  subsectionLabel,
  icon,
  label,
  path
}: {
  subsectionLabel: string
  icon: string | React.ReactElement
  label: string | React.ReactElement
  path: string
}) {
  const location = useLocation()

  const { sidebarExpanded, toggleSidebar } = useMainSidebarState()

  const { t } = useTranslation('common.sidebar')

  const locationDependentStyles = useMemo(
    () =>
      location.pathname === path
        ? 'bg-bg-200/50 hover:bg-bg-200/50! shadow-custom dark:bg-bg-800 dark:hover:bg-bg-800!'
        : 'text-bg-500',
    [path, location.pathname]
  )

  const handleClick = useCallback(() => {
    if (window.innerWidth < 1024) {
      toggleSidebar?.()
    }
  }, [])

  return (
    <Link
      key={subsectionLabel}
      className={clsx(
        'hover:bg-bg-200/30 dark:hover:bg-bg-800/30 mx-4 flex h-14 w-full items-center gap-3 rounded-lg font-medium transition-all',
        !sidebarExpanded ? 'justify-center' : '',
        sidebarExpanded ? 'pl-[3rem]' : 'px-2',
        locationDependentStyles
      )}
      to={`./${path.replace(/^\//, '')}`}
      onClick={handleClick}
    >
      <div className="flex size-7 items-center justify-center">
        {typeof icon === 'string' ? (
          <Icon className="size-6" icon={icon} />
        ) : (
          icon
        )}
      </div>

      {sidebarExpanded && (
        <span className="w-full truncate pr-4">
          {t(`apps.${label}.subsections.${_.camelCase(subsectionLabel)}`)}
        </span>
      )}
    </Link>
  )
}

export default SidebarSubsectionItem
