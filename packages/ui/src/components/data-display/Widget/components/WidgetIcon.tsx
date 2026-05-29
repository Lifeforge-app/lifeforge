import clsx from 'clsx'

import { anyColorToHex } from '@lifeforge/shared'

import { Box, Flex, Icon, Text } from '@/components/primitives'

import * as styles from '../Widget.css'

interface WidgetIconProps {
  icon: string
  iconColor?: string
  description?: React.ReactNode
  variant?: 'default' | 'large-icon'
}

export function WidgetIcon({
  icon,
  iconColor,
  description,
  variant = 'default'
}: WidgetIconProps) {
  if (variant === 'large-icon') {
    return (
      <Flex
        shadow
        className={clsx(!iconColor && styles.largeIconWrapperNoColor)}
        mb="xs"
        p={{ base: 'sm', sm: 'md' }}
        r="lg"
        style={
          iconColor
            ? { backgroundColor: anyColorToHex(iconColor) + '20' }
            : undefined
        }
      >
        <Text
          asChild
          color={iconColor ? undefined : { base: 'bg-600', dark: 'bg-400' }}
        >
          <Icon
            className={clsx(styles.largeIcon)}
            icon={icon}
            style={iconColor ? { color: iconColor } : undefined}
          />
        </Text>
      </Flex>
    )
  }

  return (
    <Box asChild r="md">
      <Flex
        align="center"
        className={clsx(!iconColor && styles.defaultIconWrapperNoColor)}
        flexShrink="0"
        height={description ? '2.75rem' : '2.25rem'}
        justify="center"
        style={
          iconColor
            ? { backgroundColor: anyColorToHex(iconColor) + '20' }
            : undefined
        }
        width={description ? '2.75rem' : '2.25rem'}
      >
        <Text
          asChild
          color={iconColor ? undefined : { base: 'bg-600', dark: 'bg-400' }}
        >
          <Icon
            icon={icon}
            style={iconColor ? { color: iconColor } : undefined}
          />
        </Text>
      </Flex>
    </Box>
  )
}
