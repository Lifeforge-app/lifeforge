import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'shared'
import { useMainSidebarState } from 'shared'

import { Flex, Text } from '@components/primitives'

import * as styles from './SidebarSubsectionItemLink.css'

function SidebarSubsectionItemLink({
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
    <Text asChild color={isActive ? undefined : 'bg-500'} weight="medium">
      <Flex
        asChild
        align="center"
        ml="md"
        mr="md"
        rounded="lg"
        style={{ gap: '0.75rem', height: '3.5rem' }}
        width="100%"
      >
        <Link
          key={subsectionLabel}
          className={clsx(
            styles.link,
            !sidebarExpanded ? styles.linkCollapsed : styles.linkExpanded,
            isActive && styles.linkActive
          )}
          to={`./${path.replace(/^\//, '')}`}
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

          {sidebarExpanded && (
            <Text truncate style={{ paddingRight: '1rem', width: '100%' }}>
              {t(`apps.${label}.subsections.${_.camelCase(subsectionLabel)}`)}
            </Text>
          )}
        </Link>
      </Flex>
    </Text>
  )
}

export default SidebarSubsectionItemLink
