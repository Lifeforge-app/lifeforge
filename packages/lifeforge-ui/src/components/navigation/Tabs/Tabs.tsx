import { Icon } from '@iconify/react'
import clsx from 'clsx'

import { Box, Flex, Text } from '@components/primitives'

import * as styles from './Tabs.css'

interface TabsProps<
  T,
  TKey = T extends ReadonlyArray<{ readonly id: infer U }> ? U : never
> {
  /** List of tab items to display. */
  items: T
  /** List of enabled tab IDs. */
  enabled: readonly TKey[]
  /** Currently active tab ID. */
  currentTab: TKey
  /** Callback function to handle tab selection. */
  onTabChange: (id: TKey) => void
  /** Additional CSS classes to apply to the tabs container. */
  className?: string
}

/**
 * A tab component that displays a list of tabs and allows switching between them.
 */
function Tabs<
  T extends ReadonlyArray<{
    readonly id: string
    readonly name: string
    readonly color?: string
    readonly icon?: string
    readonly amount?: number
  }>,
  TKey = T extends ReadonlyArray<{ readonly id: infer U }> ? U : never
>({ items, enabled, currentTab, onTabChange, className }: TabsProps<T, TKey>) {
  return (
    <Flex align="center" className={className} gapY="sm" wrap="wrap">
      {items
        .filter(({ id }) => enabled.includes(id as TKey))
        .map(({ name, icon, id, color }) => (
          <Flex
            key={id}
            align="center"
            as="button"
            bg="transparent"
            className={clsx(
              styles.tab,
              currentTab !== id
                ? styles.inactiveTab
                : !color
                  ? styles.activeTab
                  : undefined
            )}
            flex="1 1 0%"
            gap="sm"
            justify="center"
            p="md"
            style={
              color && currentTab === id
                ? {
                    borderColor: color,
                    color: color
                  }
                : {}
            }
            onClick={() => {
              onTabChange(id as TKey)
            }}
          >
            {icon && (
              <Icon
                icon={icon}
                style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }}
              />
            )}
            <Text
              as="span"
              display="block"
              weight={currentTab === id ? 'medium' : 'normal'}
            >
              {name}
            </Text>
            {items.find(item => item.name === name)?.amount !== undefined && (
              <Box
                as="span"
                className={styles.amount}
                display={{ base: 'none', sm: 'block' }}
              >
                ({items.find(item => item.name === name)?.amount})
              </Box>
            )}
          </Flex>
        ))}
    </Flex>
  )
}

export default Tabs
