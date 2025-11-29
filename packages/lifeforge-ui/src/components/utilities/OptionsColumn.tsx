import { Icon } from '@iconify/react'
import clsx from 'clsx'

import { ItemWrapper } from '@components/layouts'

import Tooltip from './Tooltip'

interface OptionsColumnProps {
  /** The title of the configuration column */
  title: string | React.ReactNode
  /** A brief description of the configuration column */
  description: string
  /** The icon to display alongside the title */
  icon: string
  /** The orientation of the configuration column */
  orientation?: 'vertical' | 'horizontal'
  /** Optional tooltip content to display alongside the title */
  tooltip?: React.ReactNode
  /** The child elements to render within the configuration column */
  children: React.ReactNode
  /** The breakpoint at which the layout should wrap. Only applies when orientation is 'horizontal' */
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | false
  /** Additional CSS classes to apply to the configuration column */
  className?: string
}

/**
 * A reusable options column component for displaying settings options.
 */
function OptionsColumn({
  title,
  description,
  icon,
  orientation = 'horizontal',
  tooltip,
  children,
  breakpoint: wrapWhen = 'md',
  className
}: OptionsColumnProps) {
  return (
    <>
      <ItemWrapper
        className={clsx(
          'flex justify-between gap-8',
          (() => {
            if (orientation === 'vertical') {
              return 'flex-col'
            }

            if (!wrapWhen) {
              return 'flex-row'
            }

            return {
              sm: 'sm:flex-row',
              md: 'md:flex-row',
              lg: 'lg:flex-row',
              xl: 'xl:flex-row'
            }[wrapWhen]
          })(),
          className
        )}
      >
        <div className="flex shrink items-center gap-3">
          <Icon className="text-bg-500 mx-3 size-6 shrink-0" icon={icon} />
          <div>
            <h3 className="flex w-full items-center gap-2 text-xl leading-normal font-medium md:w-auto">
              {title}
              {tooltip !== undefined && (
                <Tooltip icon="tabler:info-circle" id={title?.toString() || ''}>
                  {tooltip}
                </Tooltip>
              )}
            </h3>
            <p className="text-bg-500">{description}</p>
          </div>
        </div>
        <div
          className={clsx(
            'flex w-full min-w-0 shrink-0 items-center gap-3 md:w-auto',
            orientation === 'horizontal' &&
              (wrapWhen
                ? {
                    sm: 'sm:mr-2',
                    md: 'md:mr-2',
                    lg: 'lg:mr-2',
                    xl: 'xl:mr-2'
                  }[wrapWhen]
                : 'mr-2')
          )}
        >
          {children}
        </div>
      </ItemWrapper>
    </>
  )
}

export default OptionsColumn
