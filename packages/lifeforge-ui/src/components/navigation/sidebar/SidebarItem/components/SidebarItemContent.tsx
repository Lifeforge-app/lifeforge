import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ContextMenu } from '@components/overlays'

import SidebarActionButton from './SidebarActionButton'

function SidebarItemContent({
  label,
  sidebarExpanded,
  isMainSidebarItem,
  hasAI,
  number,
  contextMenuItems,
  active,
  onCancelButtonClick,
  namespace,
  actionButtonProps
}: {
  label: string | React.ReactElement
  sidebarExpanded: boolean
  isMainSidebarItem: boolean
  hasAI: boolean
  number?: number
  contextMenuItems?: React.ReactElement
  active: boolean
  onCancelButtonClick?: () => void
  namespace?: string | false
  actionButtonProps?: {
    icon: string
    onClick: () => void
  }
}) {
  const { t } = useTranslation(
    namespace === false ? [] : [namespace, 'common.sidebar']
  )

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <div className="flex-between flex w-full min-w-0 gap-3">
        {(() => {
          if (!isMainSidebarItem) {
            return (
              <div className="block w-full min-w-0 truncate">
                {typeof label === 'string' && namespace !== false
                  ? t([`${namespace}:sidebar.${_.camelCase(label)}`, label])
                  : label}{' '}
              </div>
            )
          }

          return (
            sidebarExpanded && (
              <span className="flex-between flex w-full gap-3 truncate">
                <span className="w-full min-w-0 truncate">
                  {typeof label === 'string'
                    ? t(`common.sidebar:apps.${_.camelCase(label)}.title`)
                    : label}
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
                } else if (contextMenuItems !== undefined) {
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
      {actionButtonProps && (
        <SidebarActionButton
          icon={actionButtonProps.icon}
          onClick={actionButtonProps.onClick}
        />
      )}
      {!active && contextMenuItems !== undefined && (
        <ContextMenu
          classNames={{
            wrapper: 'relative overscroll-contain',
            button: 'p-2!'
          }}
          onOpenChange={setIsMenuOpen}
        >
          {contextMenuItems}
        </ContextMenu>
      )}
    </>
  )
}

export default SidebarItemContent
