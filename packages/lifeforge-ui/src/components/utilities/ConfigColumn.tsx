import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'

import Tooltip from './Tooltip'

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
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    ref.current.getBoundingClientRect()
  }, [ref])

  return (
    <>
      <div
        ref={ref}
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
        <div className="flex shrink items-center gap-3">
          <Icon className="text-bg-500 size-6 shrink-0" icon={icon} />
          <div>
            <h3 className="flex w-full items-center gap-2 text-xl leading-normal font-medium md:w-auto">
              {title}
              {tooltip !== undefined && (
                <Tooltip icon="tabler:info-circle" id={title?.toString() || ''}>
                  {tooltip}
                </Tooltip>
              )}
            </h3>
            <p className="text-bg-500">{desc}</p>
          </div>
        </div>
        <div className="flex w-full min-w-0 shrink-0 items-center gap-3 md:w-auto">
          {children}
        </div>
      </div>
      {hasDivider && (
        <div className="border-bg-200 dark:border-bg-800/50 my-6 w-full border-b-[1.5px]" />
      )}
    </>
  )
}

export default ConfigColumn
