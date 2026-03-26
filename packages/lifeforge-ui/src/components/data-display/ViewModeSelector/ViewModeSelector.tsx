import { Icon } from '@iconify/react'
import clsx from 'clsx'

import { Flex, Text } from '@components/primitives'

import * as styles from './ViewModeSelector.css'

export interface ViewModeSelectorProps<
  T extends ReadonlyArray<{ value: string; icon?: string; text?: string }>,
  TKey = T[number]['value']
> {
  /** The current selected mode */
  currentMode: TKey
  size?: 'small' | 'default'
  /** Callback when the mode is changed */
  onModeChange: (value: TKey) => void
  /** An array of objects representing the available view modes */
  options: T
}

/**
 * A view mode selector for switching between different view modes. Nothing too fancy.
 */
function ViewModeSelector<
  T extends ReadonlyArray<{ value: string; icon?: string; text?: string }>,
  TKey = T[number]['value']
>({
  currentMode,
  size = 'default',
  onModeChange,
  options
}: ViewModeSelectorProps<T, TKey>) {
  return (
    <Flex
      shadow
      align="center"
      bg={{ base: 'bg-50', dark: 'bg-900' }}
      className={styles.container}
      gap="sm"
      p={size === 'small' ? 'xs' : 'sm'}
      rounded="lg"
    >
      {options.map(({ value, icon, text }) => (
        <Flex
          key={value}
          align="center"
          as="button"
          bg={
            value === currentMode
              ? {
                  base: 'bg-200',
                  dark: 'bg-800'
                }
              : {
                  hover: 'bg-100',
                  darkHover: 'bg-900'
                }
          }
          className={clsx(
            styles.optionSize[size],
            value === currentMode && styles.optionActive
          )}
          flex="1"
          gap="sm"
          rounded="md"
          style={{
            transition: 'all 0.2s'
          }}
          onClick={() => {
            onModeChange(value as TKey)
          }}
        >
          {icon && <Icon height="1.5rem" icon={icon} width="1.5rem" />}
          {text && (
            <Text
              size={size === 'small' ? 'sm' : 'base'}
              weight={value === currentMode ? 'semibold' : 'normal'}
            >
              {text}
            </Text>
          )}
        </Flex>
      ))}
    </Flex>
  )
}

export default ViewModeSelector
