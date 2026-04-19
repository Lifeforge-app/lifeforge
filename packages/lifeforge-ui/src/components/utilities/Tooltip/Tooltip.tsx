import { Icon } from '@iconify/react'
import _ from 'lodash'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

/**
 * A tooltip component that displays informational content when hovering over an icon.
 * For all available props, refer to the ReactTooltip documentation: https://react-tooltip.com/docs/getting-started
 */
export default function Tooltip({
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
        <Icon
          className={`text-bg-500 size-5 ${iconClassName ?? ''}`}
          icon={icon}
        />
      </span>
      <ReactTooltip
        border={`1px solid ${
          derivedTheme === 'light'
            ? bgTempPalette[200]
            : tinycolor(bgTempPalette[700]).setAlpha(0.5).toRgbString()
        }`}
        className="shadow-custom bg-bg-50! dark:bg-bg-800! z-9999 rounded-md! p-0! text-base!"
        classNameArrow="size-6! bg-bg-50! dark:bg-bg-800!"
        id={`tooltip-${_.kebabCase(id)}`}
        opacity={1}
        place="top-start"
        positionStrategy="fixed"
        {...tooltipProps}
      >
        <div className="bg-bg-50~ dark:bg-bg-800! text-bg-600 dark:text-bg-400 h-full w-full rounded-md p-4">
          {children}
        </div>
      </ReactTooltip>
    </>
  )
}
