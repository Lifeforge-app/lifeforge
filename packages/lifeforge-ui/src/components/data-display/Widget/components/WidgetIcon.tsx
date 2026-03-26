import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { anyColorToHex } from 'shared'

import { Flex } from '@components/primitives'

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
    <Flex
      align="center"
      className={clsx(
        styles.defaultIconWrapper,
        description
          ? styles.defaultIconWrapperWithDesc
          : styles.defaultIconWrapperNoDesc,
        !iconColor && styles.defaultIconWrapperNoColor
      )}
      flexShrink="0"
      justify="center"
      style={
        iconColor
          ? { backgroundColor: anyColorToHex(iconColor) + '20' }
          : undefined
      }
    >
      <Icon
        className={clsx(
          styles.defaultIcon,
          !iconColor && styles.defaultIconNoColor
        )}
        icon={icon}
        style={iconColor ? { color: iconColor } : undefined}
      />
    </Flex>
  )
}
