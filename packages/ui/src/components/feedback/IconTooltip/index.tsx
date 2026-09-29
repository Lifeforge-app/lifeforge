import _ from 'lodash'

import { Icon, type IconProps } from '@/components/primitives'

import { Tooltip } from '../Tooltip'

/**
 * A tooltip component that displays informational content when hovering over an icon.
 * For all available props, refer to the ReactTooltip documentation: https://react-tooltip.com/docs/getting-started
 */
export function IconTooltip({
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
} & React.ComponentProps<typeof Tooltip>) {
  const tooltipId = `tooltip-${_.kebabCase(id)}`

  return (
    <>
      <span data-tooltip-id={tooltipId}>
        <Icon color="muted" icon={icon} {...iconProps} />
      </span>
      <Tooltip id={tooltipId} place="top-start" {...tooltipProps}>
        {children}
      </Tooltip>
    </>
  )
}
