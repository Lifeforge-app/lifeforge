import { Icon as IconifyIcon } from '@iconify/react'

import { Text, type TextProps } from '../Text'

export type IconProps = TextProps & {
  icon: string
  size?: number | string
}

export function Icon({ icon, size = '1.25em', color, ...rest }: IconProps) {
  return (
    <Text
      as="span"
      color={color}
      {...rest}
      asChild
      display="inline-block"
      style={{ width: size, height: size, ...rest.style }}
    >
      <IconifyIcon icon={icon} />
    </Text>
  )
}
