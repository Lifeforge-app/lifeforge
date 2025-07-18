import { HamburgerMenu } from '@components/buttons'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
      <div className="flex-between flex w-full min-w-0 gap-3">
        {(() => {
          if (!isMainSidebarItem) {
            return (
              <div className="block w-full min-w-0 truncate">
                {needTranslate
                  ? t([`${namespace}:sidebar.${_.camelCase(name)}`, name])
                  : name}
              </div>
            )
          }

          return (
            sidebarExpanded && (
              <span className="flex-between flex w-full gap-2 truncate">
                <span className="max-w-48 min-w-0 truncate">
                  {t(`common.sidebar:apps.${_.camelCase(name)}.title`)}
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
          classNames={{
            wrapper: clsx(
              'relative overscroll-contain',
              !isMenuOpen && 'hidden group-hover:block'
            ),
            button: 'p-2!'
          }}
          onClick={e => {
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
