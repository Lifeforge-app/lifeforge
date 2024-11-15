import { Icon } from '@iconify/react'
import { t } from 'i18next'
import React from 'react'
import { toCamelCase } from '@utils/strings'

function SidebarItemContent({
  name,
  sidebarExpanded,
  isMainSidebarItem,
  hasAI,
  number,
  isMenuOpen,
  hamburgerMenuItems,
  active,
  onCancelButtonClick,
  needTranslate = false
}: {
  name: string
  sidebarExpanded: boolean
  isMainSidebarItem: boolean
  hasAI: boolean
  number?: number
  isMenuOpen: boolean
  hamburgerMenuItems?: React.ReactElement
  active: boolean
  onCancelButtonClick?: () => void
  needTranslate?: boolean
}): React.ReactElement {
  return (
    <span className="flex-between flex w-full min-w-0 gap-4">
      {sidebarExpanded &&
        (isMainSidebarItem ? (
          <span className="flex-between flex w-full gap-2 truncate">
            <span className="min-w-0 max-w-48 truncate">
              {t(`modules.${toCamelCase(name)}`)}
            </span>
            {hasAI && (
              <Icon icon="mage:stars-c" className="size-4 text-custom-500" />
            )}
          </span>
        ) : (
          <span className="block w-full min-w-0 truncate">
            {needTranslate
              ? t(
                  `sidebar.${toCamelCase(
                    location.pathname.split('/').slice(1)[0].replace(/-/g, ' ')
                  )}.${toCamelCase(name)}`
                )
              : name}
          </span>
        ))}
      {number !== undefined && (
        <span
          className={`pr-2 text-sm ${
            isMenuOpen || (onCancelButtonClick !== undefined && active)
              ? 'hidden'
              : hamburgerMenuItems !== undefined
              ? 'group-hover:hidden'
              : 'block'
          }`}
        >
          {number.toLocaleString()}
        </span>
      )}
    </span>
  )
}

export default SidebarItemContent
