import { Bordered, Flex, Icon, Text, Transition } from '@/components/primitives'

export interface TabsProps<
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
export function Tabs<
  T extends ReadonlyArray<{
    readonly id: string
    readonly name: string
    readonly color?: string
    readonly icon?: string
    readonly amount?: number | ((currentTab: string) => number)
  }>,
  TKey = T extends ReadonlyArray<{ readonly id: infer U }> ? U : never
>({ items, enabled, currentTab, onTabChange, className }: TabsProps<T, TKey>) {
  return (
    <Flex align="center" className={className} gapY="sm" wrap="wrap">
      {items
        .filter(({ id }) => enabled.includes(id as TKey))
        .map(({ name, icon, id, color, amount }) => {
          const resolvedAmount =
            typeof amount === 'function' ? amount(currentTab as string) : amount

          return (
            <Bordered
              key={id}
              asChild
              borderColor={
                currentTab !== id
                  ? {
                      base: 'bg-400',
                      hover: 'bg-800',
                      dark: 'bg-500',
                      darkHover: 'bg-200'
                    }
                  : !color
                    ? { base: 'custom-500' }
                    : undefined
              }
              borderSide="bottom"
              borderWidth="2px"
              style={
                color && currentTab === id ? { borderColor: color } : undefined
              }
            >
              <Transition>
                <Text
                  asChild
                  color={
                    currentTab === id
                      ? { base: 'custom-500' }
                      : {
                          base: 'bg-400',
                          hover: 'bg-800',
                          dark: 'bg-500',
                          darkHover: 'bg-200'
                        }
                  }
                  tracking="wide"
                  transform="uppercase"
                  whiteSpace="nowrap"
                >
                  <Flex
                    align="center"
                    as="button"
                    bg="transparent"
                    flex="1 1 0%"
                    gap="sm"
                    justify="center"
                    p="md"
                    style={color && currentTab === id ? { color } : {}}
                    onClick={() => {
                      onTabChange(id as TKey)
                    }}
                  >
                    {icon && <Icon icon={icon} />}
                    <Text
                      as="span"
                      display="block"
                      weight={currentTab === id ? 'medium' : 'normal'}
                    >
                      {name}
                    </Text>
                    {resolvedAmount !== undefined && (
                      <Text
                        as="span"
                        display={{ base: 'none', sm: 'block' }}
                        size="sm"
                      >
                        ({resolvedAmount})
                      </Text>
                    )}
                  </Flex>
                </Text>
              </Transition>
            </Bordered>
          )
        })}
    </Flex>
  )
}
