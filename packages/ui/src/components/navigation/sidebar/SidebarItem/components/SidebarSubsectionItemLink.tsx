import _ from 'lodash'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'


import { Flex, Icon, Text, Transition } from '@/components/primitives'
import { useMainSidebarState } from '@/providers'
import { colorWithOpacity } from '@/system/colors/color-with-opacity'
import { Link, useLocation } from 'react-router'

export function SidebarSubsectionItemLink({
  subsectionLabel,
  icon,
  label,
  path
}: {
  subsectionLabel: string
  icon: string | React.ReactElement
  label: string | React.ReactElement
  path: string
}) {
  const location = useLocation()

  const { sidebarExpanded, toggleSidebar } = useMainSidebarState()

  const { t } = useTranslation('common.sidebar')

  const isActive = useMemo(
    () => location.pathname === path,
    [path, location.pathname]
  )

  const handleClick = useCallback(() => {
    if (window.innerWidth < 1024) {
      toggleSidebar?.()
    }
  }, [])

  return (
    <Transition>
      <Text asChild color={isActive ? undefined : 'bg-500'} weight="medium">
        <Flex
          align="center"
          as={Link}
          bg={
            isActive
              ? {
                  base: colorWithOpacity('bg-200', '50%'),
                  dark: 'bg-800'
                }
              : {
                  hover: colorWithOpacity('bg-200', '30%'),
                  darkHover: colorWithOpacity('bg-800', '30%')
                }
          }
          className={isActive ? 'active' : undefined}
          justify={!sidebarExpanded ? 'center' : undefined}
          ml="md"
          mr="md"
          pl={!sidebarExpanded ? 'sm' : '2xl'}
          pr={!sidebarExpanded ? 'sm' : undefined}
          r="lg"
          shadow={isActive ? true : undefined}
          style={{ gap: '0.75rem', height: '3.5rem' }}
          to={`./${path.replace(/^\//, '')}`}
          width="100%"
          onClick={handleClick}
        >
          <Flex centered height="1.75rem" width="1.75rem">
            {typeof icon === 'string' ? (
              <Icon icon={icon} size="1.5rem" />
            ) : (
              icon
            )}
          </Flex>

          {sidebarExpanded && (
            <Text truncate style={{ paddingRight: '1rem', width: '100%' }}>
              {t(`apps.${label}.subsections.${_.camelCase(subsectionLabel)}`)}
            </Text>
          )}
        </Flex>
      </Text>
    </Transition>
  )
}
