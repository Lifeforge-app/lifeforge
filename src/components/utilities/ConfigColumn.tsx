import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { Tooltip } from 'react-tooltip'
import { toDashCase } from '../../../tools/module-tools/utils/strings'

function ConfigColumn({
  title,
  desc,
  icon,
  vertical = false,

  tooltip,
  hasDivider = true,
  children,
  wrapWhen = 'md',
  noDefaultBreakpoints = false,
  className
}: {
  title: string | React.ReactNode
  desc: string
  icon: string
  vertical?: boolean
  tooltip?: React.ReactNode
  hasDivider?: boolean
  children: React.ReactNode
  wrapWhen?: 'sm' | 'md' | 'lg' | 'xl'
  noDefaultBreakpoints?: boolean
  className?: string
}): React.ReactElement {
  return (
    <>
      <div
        className={clsx(
          'flex w-full min-w-0 flex-col justify-between gap-8 px-4',
          !vertical &&
            !noDefaultBreakpoints &&
            {
              sm: 'sm:flex-row',
              md: 'md:flex-row',
              lg: 'lg:flex-row',
              xl: 'xl:flex-row'
            }[wrapWhen],
          vertical && 'flex-col',
          className
        )}
      >
        <div className="flex shrink items-center gap-4">
          <Icon className="size-6 shrink-0 text-bg-500" icon={icon} />
          <div>
            <h3 className="flex w-full items-center gap-2 text-xl font-medium leading-normal md:w-auto">
              {title}
              {tooltip !== undefined && (
                <span
                  data-tooltip-id={`tooltip-${toDashCase(
                    title?.toString() ?? ''
                  )}`}
                >
                  <Icon
                    className="size-5 text-bg-500"
                    icon="tabler:info-circle"
                  />
                </span>
              )}
            </h3>
            <p className="text-bg-500">{desc}</p>
          </div>
        </div>
        <div className="flex w-full min-w-0 shrink-0 items-center gap-4 md:w-auto">
          {children}
        </div>
        {tooltip !== undefined && (
          <Tooltip
            className="z-9999 rounded-md! bg-bg-50 p-4! text-base! text-bg-800 shadow-custom dark:bg-bg-900 dark:text-bg-50"
            classNameArrow="size-6!"
            id={`tooltip-${toDashCase(title?.toString() ?? '')}`}
            opacity={1}
            place="top-start"
            positionStrategy="fixed"
          >
            {tooltip}
          </Tooltip>
        )}
      </div>
      {hasDivider && (
        <div className="my-6 w-full border-b-[1.5px] border-bg-200 dark:border-bg-800/50" />
      )}
    </>
  )
}

export default ConfigColumn
