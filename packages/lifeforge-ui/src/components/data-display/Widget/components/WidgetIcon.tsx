import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { anyColorToHex } from 'shared'

import { Box, Flex, Text } from '@components/primitives'

import * as styles from '../Widget.css'

interface WidgetIconProps {
  icon: string
  iconColor?: string
  description?: React.ReactNode
  variant?: 'default' | 'large-icon'
}

export default function WidgetIcon({
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
        rounded="lg"
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
    <Box asChild rounded="md">
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
            height="1.25rem"
            icon={icon}
            style={iconColor ? { color: iconColor } : undefined}
            width="1.25rem"
          />
        </Text>
      </Flex>
    </Box>
  )
}
