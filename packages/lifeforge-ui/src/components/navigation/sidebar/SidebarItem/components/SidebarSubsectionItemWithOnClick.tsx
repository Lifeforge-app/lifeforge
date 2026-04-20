import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useModuleSidebarState } from 'shared'

import { Flex, Text } from '@components/primitives'

import * as styles from './SidebarSubsectionItemWithOnClick.css'

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
    <Text asChild color={active ? undefined : 'bg-500'} weight="medium">
      <Flex
        asChild
        align="center"
        ml="md"
        mr="md"
        rounded="lg"
        style={{ gap: '0.75rem', height: '3.5rem', paddingLeft: '3rem' }}
        width="100%"
      >
        <button
          key={subsectionLabel}
          className={clsx(styles.button, active && styles.buttonActive)}
          onClick={handleClick}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '1.75rem',
              width: '1.75rem'
            }}
          >
            {typeof icon === 'string' ? (
              <Icon icon={icon} style={{ height: '1.5rem', width: '1.5rem' }} />
            ) : (
              icon
            )}
          </div>
          <Text truncate style={{ paddingRight: '1rem', width: '100%' }}>
            {namespace !== false
              ? t([
                  `apps.${_.camelCase(label.toString())}.subsections.${_.camelCase(
                    subsectionLabel
                  )}`,
                  subsectionLabel
                ])
              : subsectionLabel}
          </Text>
          {amount !== undefined && (
            <span
              style={{
                marginRight: '1.25rem',
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Text as="span" color="bg-500" size="sm" weight="medium">
                {amount}
              </Text>
            </span>
          )}
        </button>
      </Flex>
    </Text>
  )
}

export default SidebarSubsectionItemWithOnClick
