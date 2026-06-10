import _ from 'lodash'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Flex, Icon, Text, Transition } from '@/components/primitives'
import { useModuleSidebarState } from '@/providers'
import { colorWithOpacity } from '@/system'

export function SidebarSubsectionItemWithOnClick({
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
    <Transition>
      <Text
        asChild
        align="left"
        color={active ? undefined : 'bg-500'}
        weight="medium"
      >
        <Flex
          asChild
          align="center"
          as="button"
          bg={
            active
              ? {
                  base: colorWithOpacity('bg-200', '50%'),
                  dark: 'bg-800'
                }
              : {
                  hover: colorWithOpacity('bg-200', '30%'),
                  darkHover: colorWithOpacity('bg-800', '30%')
                }
          }
          gap="md"
          height="3.5rem"
          ml="md"
          mr="md"
          r="lg"
          style={{ paddingLeft: '3rem' }}
          width="100%"
          onClick={handleClick}
        >
          <Flex
            align="center"
            height="1.75rem"
            justify="center"
            width="1.75rem"
          >
            {typeof icon === 'string' ? (
              <Icon icon={icon} size="1.5rem" />
            ) : (
              icon
            )}
          </Flex>
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
            <Flex align="center" gap="xs" mr="md">
              <Text as="span" color="muted" size="sm" weight="medium">
                {amount}
              </Text>
            </Flex>
          )}
        </Flex>
      </Text>
    </Transition>
  )
}
