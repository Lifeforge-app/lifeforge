import { ContextMenu } from '@components/buttons'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  needTranslate
}: {
  label: string
  sidebarExpanded: boolean
  isMainSidebarItem: boolean
  hasAI: boolean
  number?: number
  contextMenuItems?: React.ReactElement
  active: boolean
  onCancelButtonClick?: () => void
  namespace?: string
  needTranslate?: boolean
}) {
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
                  ? t([`${namespace}:sidebar.${_.camelCase(label)}`, label])
                  : label}{' '}
              </div>
            )
          }

          return (
            sidebarExpanded && (
              <span className="flex-between flex w-full gap-4 truncate">
                <span className="w-full min-w-0 truncate">
                  {t(`common.sidebar:apps.${_.camelCase(label)}.title`)}
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
      {!active && contextMenuItems !== undefined && (
        <ContextMenu
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
          {contextMenuItems}
        </ContextMenu>
      )}
    </>
  )
}

export default SidebarItemContent
