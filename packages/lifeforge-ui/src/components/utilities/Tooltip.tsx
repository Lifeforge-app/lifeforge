import { Icon } from '@iconify/react'
import _ from 'lodash'
import { Tooltip as ReactTooltip } from 'react-tooltip'

export default function Tooltip({
  id,
  icon,
  children,
  tooltipProps
}: {
  id: string
  icon: string
  children: React.ReactNode
  tooltipProps?: Record<string, unknown>
}) {
  return (
    <>
      <span data-tooltip-id={`tooltip-${_.kebabCase(id)}`}>
        <Icon className="text-bg-500 size-5" icon={icon} />
      </span>
      <ReactTooltip
        className="z-9999 rounded-md! bg-bg-50 p-4! text-base! text-bg-800 shadow-custom dark:bg-bg-900 dark:text-bg-50"
        classNameArrow="size-6!"
        id={`tooltip-${_.kebabCase(id)}`}
        opacity={1}
        place="top-start"
        positionStrategy="fixed"
        {...tooltipProps}
      >
        {children}
      </ReactTooltip>
    </>
  )
}
