import _ from 'lodash'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import tinycolor from 'tinycolor2'

import { usePersonalization } from '@lifeforge/shared'

import { Box, Icon, Text } from '@/components/primitives'

/**
 * A tooltip component that displays informational content when hovering over an icon.
 * For all available props, refer to the ReactTooltip documentation: https://react-tooltip.com/docs/getting-started
 */
export function Tooltip({
  id,
  icon,
  iconClassName,
  children,
  ...tooltipProps
}: {
  /** The unique identifier for the tooltip element. */
  id: string
  /** The icon to display as the tooltip trigger. Should be a valid icon name from Iconify. */
  icon: string
  /** Optional additional class name(s) to apply to the icon element. */
  iconClassName?: string
  /** The content to display inside the tooltip when triggered. */
  children: React.ReactNode
  /** Additional properties to pass to the underlying ReactTooltip component. */
} & React.ComponentProps<typeof ReactTooltip>) {
  const { derivedTheme, bgTempPalette } = usePersonalization()

  return (
    <>
      <span data-tooltip-id={`tooltip-${_.kebabCase(id)}`}>
        <Icon className={iconClassName ?? ''} color="muted" icon={icon} />
      </span>
      <Box
        asChild
        r="md"
        style={{
          background:
            derivedTheme === 'light'
              ? 'var(--color-bg-50)'
              : 'var(--color-bg-800)',
          boxShadow: 'var(--custom-shadow)',
          zIndex: 9999
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
