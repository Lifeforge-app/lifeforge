import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { anyColorToHex } from 'shared'

import { Box, Flex } from '@components/primitives'

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
        className={clsx(
          styles.largeIconWrapper,
          !iconColor && styles.largeIconWrapperNoColor
        )}
        mb="xs"
        p={{ base: 'sm', sm: 'md' }}
        style={
          iconColor
            ? { backgroundColor: anyColorToHex(iconColor) + '20' }
            : undefined
        }
      >
        <Icon
          className={clsx(
            styles.largeIcon,
            !iconColor && styles.largeIconNoColor
          )}
          icon={icon}
          style={iconColor ? { color: iconColor } : undefined}
        />
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
        <Icon
          className={clsx(!iconColor && styles.defaultIconNoColor)}
          height="1.25rem"
          icon={icon}
          style={iconColor ? { color: iconColor } : undefined}
          width="1.25rem"
        />
      </Flex>
    </Box>
  )
}
