import _ from 'lodash'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import tinycolor from 'tinycolor2'

import { Box, Icon, type IconProps, Text } from '@/components/primitives'
import { usePersonalization } from '@/providers'

/**
 * A tooltip component that displays informational content when hovering over an icon.
 * For all available props, refer to the ReactTooltip documentation: https://react-tooltip.com/docs/getting-started
 */
export function Tooltip({
  id,
  icon,
  iconProps,
  children,
  ...tooltipProps
}: {
  /** The unique identifier for the tooltip element. */
  id: string
  /** The icon to display as the tooltip trigger. Should be a valid icon name from Iconify. */
  icon: string
  /** Optional additional class name(s) to apply to the icon element. */
  iconProps?: Omit<IconProps, 'icon'>
  /** The content to display inside the tooltip when triggered. */
  children: React.ReactNode
  /** Additional properties to pass to the underlying ReactTooltip component. */
} & React.ComponentProps<typeof ReactTooltip>) {
  const { derivedTheme, bgTempPalette } = usePersonalization()

  return (
    <>
      <span data-tooltip-id={`tooltip-${_.kebabCase(id)}`}>
        <Icon color="muted" icon={icon} {...iconProps} />
      </span>
      <Box
        asChild
        shadow
        // Intentionally kept as inline style due to the styling limitation
        // of react-tooltip
        style={{
          background:
            derivedTheme === 'light'
              ? 'var(--color-bg-50)'
              : 'var(--color-bg-800)',
          borderRadius: '0.5em',
          zIndex: '9999'
        }}
      >
        <ReactTooltip
          border={`1px solid ${
            derivedTheme === 'light'
              ? bgTempPalette[200]
              : tinycolor(bgTempPalette[700]).setAlpha(0.5).toRgbString()
          }`}
          id={`tooltip-${_.kebabCase(id)}`}
          opacity={1}
          place="top-start"
          positionStrategy="fixed"
          {...tooltipProps}
        >
          <Text as="div" color={{ base: 'bg-600', dark: 'bg-400' }} py="sm">
            {children}
          </Text>
        </ReactTooltip>
      </Box>
    </>
  )
}
