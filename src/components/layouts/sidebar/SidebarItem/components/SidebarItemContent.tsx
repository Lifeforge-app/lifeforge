import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import { toCamelCase } from '@utils/strings'

function SidebarItemContent({
  name,
  sidebarExpanded,
  isMainSidebarItem,
  hasAI,
  number,
  hamburgerMenuItems,
  active,
  onCancelButtonClick,
  namespace,
  needTranslate
}: {
  name: string
  sidebarExpanded: boolean
  isMainSidebarItem: boolean
  hasAI: boolean
  number?: number
  hamburgerMenuItems?: React.ReactElement
  active: boolean
  onCancelButtonClick?: () => void
  namespace?: string
  needTranslate?: boolean
}): React.ReactElement {
  const { t } = useTranslation([namespace, 'common.sidebar'])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <span className="flex-between flex w-full min-w-0 gap-4">
        {sidebarExpanded &&
          (isMainSidebarItem ? (
            <span className="flex-between flex w-full gap-2 truncate">
              <span className="min-w-0 max-w-48 truncate">
                {t(`common.sidebar:modules.${toCamelCase(name)}.title`)}
              </span>
              {hasAI && (
                <Icon className="size-4 text-custom-500" icon="mage:stars-c" />
              )}
            </span>
          ) : (
            <span className="block w-full min-w-0 truncate">
              {needTranslate
                ? t([`${namespace}:sidebar.${toCamelCase(name)}`, name])
                : name}
            </span>
          ))}
        {number !== undefined && (
          <span
            className={clsx(
              'pr-2 text-sm',
              (() => {
                if (
                  isMenuOpen ||
                  (onCancelButtonClick !== undefined && active)
                ) {
                  return 'hidden'
                } else if (hamburgerMenuItems !== undefined) {
                  return 'group-hover:hidden'
                } else {
                  return 'block'
                }
              })()
            )}
          >
            {number.toLocaleString()}
          </span>
        )}
      </span>
      {!active && hamburgerMenuItems !== undefined && (
        <HamburgerMenu
          smallerPadding
          className={clsx(
            'relative overscroll-contain',
            !isMenuOpen && 'hidden group-hover:block'
          )}
          onButtonClick={e => {
            e.stopPropagation()
            setIsMenuOpen(true)
          }}
          onClose={() => {
            setIsMenuOpen(false)
          }}
        >
          {hamburgerMenuItems}
        </HamburgerMenu>
      )}
    </>
  )
}

export default SidebarItemContent
