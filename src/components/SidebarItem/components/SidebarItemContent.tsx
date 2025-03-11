import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { HamburgerMenu } from '@lifeforge/ui'

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
      <div className="flex-between flex w-full min-w-0 gap-4">
        {(() => {
          if (!isMainSidebarItem) {
            return (
              <span className="block w-full min-w-0 truncate">
                {needTranslate
                  ? t([`${namespace}:sidebar.${_.camelCase(name)}`, name])
                  : name}
              </span>
            )
          }

          return (
            sidebarExpanded && (
              <span className="flex-between flex w-full gap-2 truncate">
                <span className="max-w-48 min-w-0 truncate">
                  {t(`common.sidebar:modules.${_.camelCase(name)}.title`)}
                </span>
                {hasAI && (
                  <Icon
                    className="text-custom-500 size-4"
                    icon="mage:stars-c"
                  />
                )}
              </span>
            )
          )
        })()}
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
      </div>
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
