import { Icon as IconifyIcon } from '@iconify/react'
import clsx from 'clsx'

import type { ResponsiveProp } from '@/system'
import { getResponsiveStyles } from '@/system/responsive/utils/getResponsiveLayoutStyles'

import { Box } from '../Box'
import { Text, type TextProps } from '../Text'

export type IconProps = Omit<TextProps, 'size'> & {
  icon: string
  size?: ResponsiveProp<string | number>
}

export function Icon({ icon, size = '1.25em', color, ...rest }: IconProps) {
  const resolvedSize = getResponsiveStyles(
    {
      className: 'lf-size',
      customProperties: ['--lf-size']
    },
    size
  )

  return (
    <Box asChild flexShrink="0">
      <Text
        as="span"
        color={color}
        {...rest}
        asChild
        className={clsx(resolvedSize?.className, rest.className)}
        style={{ ...resolvedSize?.style, ...rest.style }}
      >
        <IconifyIcon icon={icon} />
      </Text>
    </Box>
  )
}
