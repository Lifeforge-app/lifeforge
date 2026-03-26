import { Icon } from '@iconify/react'
import clsx from 'clsx'

import { Box, Flex } from '@components/primitives'

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
  /** Additional class name for the container */
  className?: string
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
  options,
  className
}: ViewModeSelectorProps<T, TKey>) {
  return (
    <Flex
      align="center"
      className={clsx(styles.container, styles.containerSize[size], className)}
      gap="sm"
    >
      {options.map(({ value, icon, text }) => (
        <Box
          key={value}
          as="button"
          className={clsx(
            styles.option,
            styles.optionSize[size],
            value === currentMode ? styles.optionActive : styles.optionInactive
          )}
          onClick={() => {
            onModeChange(value as TKey)
          }}
        >
          <Flex align="center" gap="sm">
            {icon && <Icon className={styles.iconSize} icon={icon} />}
            {text && <span>{text}</span>}
          </Flex>
        </Box>
      ))}
    </Flex>
  )
}

export default ViewModeSelector
