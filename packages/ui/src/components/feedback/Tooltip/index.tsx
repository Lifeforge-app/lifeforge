import _ from 'lodash'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import { Box, Icon, type IconProps, Text } from '@/components/primitives'

import { tooltip } from './Tooltip.css'

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
  return (
    <>
      <span data-tooltip-id={`tooltip-${_.kebabCase(id)}`}>
        <Icon color="muted" icon={icon} {...iconProps} />
      </span>
      <Box
        asChild
        // Intentionally kept as inline style due to the styling limitation of react-tooltip
        style={{
          padding: '0',
          zIndex: '9999'
        }}
      >
        <ReactTooltip
          className={tooltip}
          id={`tooltip-${_.kebabCase(id)}`}
          opacity={1}
          place="top-start"
          portalRoot={document.body}
          positionStrategy="fixed"
          {...tooltipProps}
        >
          <Box
            shadow
            bg={{ base: 'bg-50', dark: 'bg-800' }}
            px="md"
            py="sm"
            r="md"
          >
            <Text as="div" color={{ base: 'bg-600', dark: 'bg-400' }} py="sm">
              {children}
            </Text>
          </Box>
        </ReactTooltip>
      </Box>
    </>
  )
}
