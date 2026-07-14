import {
  Flex,
  type FlexProps,
  Icon,
  Text,
  Transition
} from '@/components/primitives'

export interface ViewModeSelectorProps<
  T extends ReadonlyArray<{ value: string; icon?: string; text?: string }>,
  TKey = T[number]['value']
> extends FlexProps<'div'> {
  /** The current selected mode */
  currentMode: TKey
  size?: 'small' | 'default'
  /** Callback when the mode is changed */
  onModeChange: (value: TKey) => void
  /** An array of objects representing the available view modes */
  modes: T
}

/**
 * A view mode selector for switching between different view modes. Nothing too fancy.
 */
export function ViewModeSelector<
  T extends ReadonlyArray<{ value: string; icon?: string; text?: string }>,
  TKey = T[number]['value']
>({
  currentMode,
  size = 'default',
  onModeChange,
  modes,
  ...rest
}: ViewModeSelectorProps<T, TKey>) {
  return (
    <Flex
      shadow
      align="center"
      bg={{ base: 'bg-50', dark: 'bg-900' }}
      gap="xs"
      height="4em"
      p={size === 'small' ? 'xs' : 'sm'}
      r="lg"
      {...rest}
    >
      {modes.map(({ value, icon, text }) => (
        <Transition key={value}>
          <Text
            asChild
            color={
              value === currentMode
                ? {
                    base: 'bg-800',
                    dark: 'bg-100'
                  }
                : 'muted'
            }
            size={size === 'small' ? 'sm' : 'base'}
            weight={value === currentMode ? 'semibold' : 'normal'}
            whiteSpace="nowrap"
          >
            <Flex
              centered
              as="button"
              bg={
                value === currentMode
                  ? {
                      base: 'bg-200',
                      dark: 'bg-800'
                    }
                  : {
                      hover: 'bg-200',
                      darkHover: 'bg-800'
                    }
              }
              flex="1"
              gap="sm"
              height="100%"
              px={size === 'small' ? 'sm' : 'md'}
              py={size === 'small' ? 'xs' : 'sm'}
              r="md"
              onClick={() => {
                onModeChange(value as TKey)
              }}
            >
              {icon && <Icon icon={icon} size="1.5em" />}
              {text}
            </Flex>
          </Text>
        </Transition>
      ))}
    </Flex>
  )
}
