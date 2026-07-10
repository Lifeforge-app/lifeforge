import { Flex, Icon } from '@/components/primitives'
import {
  type ThemeConditionProp,
  type TokenizedColor,
  colorWithOpacity
} from '@/system'

interface WidgetIconProps {
  icon: string
  iconColor?: TokenizedColor
  description?: React.ReactNode
  variant?: 'default' | 'large-icon'
}

function getVariants(hasDescription: boolean, iconColor?: TokenizedColor) {
  const bgColor = colorWithOpacity(iconColor ?? 'bg-500', '10%')

  const color: ThemeConditionProp<TokenizedColor> =
    iconColor ?? ({ base: 'bg-600', dark: 'bg-400' } as const)

  const size = hasDescription ? '2.75rem' : '2.25rem'

  return {
    default: {
      flex: { height: size, r: 'md', width: size, bg: bgColor },
      icon: { color: color }
    },
    'large-icon': {
      flex: {
        bg: bgColor,
        mb: 'xs',
        p: { base: 'sm', sm: 'md' },
        r: 'lg',
        shadow: true
      },
      icon: {
        color: color,
        size: { base: '2em', sm: '2.5em' }
      }
    }
  } as const
}

export function WidgetIcon({
  icon,
  iconColor,
  description,
  variant = 'default'
}: WidgetIconProps) {
  const v = getVariants(!!description, iconColor)[variant]

  return (
    <Flex centered flexShrink="0" {...v.flex}>
      <Icon icon={icon} {...v.icon} />
    </Flex>
  )
}
