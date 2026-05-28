import _ from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ContextMenu } from '@components/overlays'
import { Box, Flex, Text } from '@components/primitives'

import { SidebarActionButton } from './SidebarActionButton'
import * as styles from './SidebarItemContent.css'

export function SidebarItemContent({
  label,
  sidebarExpanded,
  isMainSidebarItem,
  number,
  contextMenuItems,
  active,
  onCancelButtonClick,
  namespace,
  actionButtonProps,
  hasSubsection
}: {
  label: string | React.ReactElement
  sidebarExpanded: boolean
  isMainSidebarItem: boolean
  number?: number
  contextMenuItems?: React.ReactElement
  active: boolean
  onCancelButtonClick?: () => void
  namespace?: string | false
  actionButtonProps?: {
    icon: string
    onClick: () => void
  }
  hasSubsection: boolean
}) {
  const { t } = useTranslation(
    namespace === false ? [] : [namespace, 'common.sidebar']
  )

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <Flex
        align="center"
        justify="between"
        minWidth="0"
        style={{ gap: '0.75rem' }}
        width="100%"
      >
        {(() => {
          if (!isMainSidebarItem) {
            return (
              <Box asChild minWidth="0" width="100%">
                <Text truncate as="div">
                  {typeof label === 'string' && namespace !== false
                    ? t([`${namespace}:sidebar.${_.camelCase(label)}`, label])
                    : label}{' '}
                  {number !== undefined && hasSubsection && (
                    <Text
                      as="span"
                      color={{ base: 'bg-400', dark: 'bg-600' }}
                      size="sm"
                    >
                      ({number})
                    </Text>
                  )}
                </Text>
              </Box>
            )
          }

          return (
            sidebarExpanded && (
              <Flex
                align="center"
                justify="between"
                minWidth="0"
                overflow="hidden"
                style={{ gap: '0.75rem' }}
                width="100%"
              >
                <Box asChild minWidth="0" width="100%">
                  <Text truncate>
                    {typeof label === 'string'
                      ? t(`common.sidebar:apps.${label}.title`)
                      : label}
                  </Text>
                </Box>
              </Flex>
            )
          )
        })()}
        {number !== undefined && !hasSubsection && (
          <Text
            as="span"
            className={
              !isMenuOpen &&
              !(onCancelButtonClick !== undefined && active) &&
              contextMenuItems !== undefined
                ? styles.numberBadgeGroupHoverHide
                : undefined
            }
            size="sm"
            style={{
              display:
                isMenuOpen || (onCancelButtonClick !== undefined && active)
                  ? 'none'
                  : undefined,
              paddingRight: '0.5rem'
            }}
          >
            {number.toLocaleString()}
          </Text>
        )}
      </Flex>
      {actionButtonProps && (
        <SidebarActionButton
          icon={actionButtonProps.icon}
          onClick={actionButtonProps.onClick}
        />
      )}
      {!active && contextMenuItems !== undefined && (
        <ContextMenu
          classNames={{ button: styles.contextMenuGroupHoverShow }}
          styles={{
            wrapper: { position: 'relative', overscrollBehavior: 'contain' },
            button: { padding: '0.5em' }
          }}
          onOpenChange={setIsMenuOpen}
        >
          {contextMenuItems}
        </ContextMenu>
      )}
    </>
  )
}

