import clsx from 'clsx'

import { Flex, Text } from '@/components/primitives'

import * as styles from './SidebarItemWrapper.css'

export function SidebarItemWrapper({
  active,
  children,
  className,
  onClick
}: {
  active: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <Text
      asChild
      color={active ? { base: 'bg-800', dark: 'bg-50' } : 'bg-500'}
      weight={active ? 'semibold' : undefined}
    >
      <Flex
        align="center"
        as="li"
        className={clsx(
          'sidebar-item',
          styles.listItemBase,
          active && styles.listItemActiveIndicator,
          className
        )}
        justify="center"
        position="relative"
        px="md"
      >
        <Flex
          asChild
          align="center"
          justify="between"
          pl="md"
          position="relative"
          rounded="lg"
          style={{ gap: '0.75rem', height: '3.5rem', paddingRight: '0.75rem' }}
          width="100%"
        >
          <div
            className={clsx(
              'group',
              styles.innerButtonInteractive,
              active ? styles.innerButtonActive : styles.innerButtonInactive
            )}
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onClick?.()
              }
            }}
          >
            {children}
          </div>
        </Flex>
      </Flex>
    </Text>
  )
}
