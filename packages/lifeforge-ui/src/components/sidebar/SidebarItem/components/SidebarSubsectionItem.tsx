import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'
import { useSidebarState } from 'shared'

function SidebarSubsectionItem({
  subsectionLabel,
  icon,
  label,
  path
}: {
  subsectionLabel: string
  icon: string | React.ReactElement
  label: string
  path: string
}) {
  const location = useLocation()

  const { sidebarExpanded, toggleSidebar } = useSidebarState()

  const { t } = useTranslation('common.sidebar')

  const locationDependentStyles = useMemo(
    () =>
      location.pathname.split('/').slice(1)[0] === _.kebabCase(label) &&
      (location.pathname.split('/').slice(1)[1] === path ||
        (location.pathname
          .replace(_.kebabCase(label), '')
          .replace(/\//g, '') === '' &&
          subsectionLabel === 'Dashboard'))
        ? 'bg-bg-200/50 hover:bg-bg-200/50! shadow-custom dark:bg-bg-800 dark:hover:bg-bg-800!'
        : 'text-bg-500',
    [name, path, subsectionLabel, location.pathname]
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
        'hover:bg-bg-200/30 dark:hover:bg-bg-800/30 mx-4 flex w-full items-center gap-3 rounded-lg py-4 font-medium transition-all',
        !sidebarExpanded ? 'justify-center' : '',
        sidebarExpanded ? 'pl-[3rem]' : 'px-2',
        locationDependentStyles
      )}
      to={`./${_.kebabCase(label)}/${path}`}
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
          {t(
            `apps.${_.camelCase(label)}.subsections.${_.camelCase(
              subsectionLabel
            )}`
          )}
        </span>
      )}
    </Link>
  )
}

export default SidebarSubsectionItem
