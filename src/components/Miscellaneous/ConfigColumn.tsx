import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { Tooltip } from 'react-tooltip'
import { toDashCase } from '../../../tools/createModule/utils/strings'

function ConfigColumn({
  title,
  desc,
  icon,
  vertical = false,
  tooltip,
  hasDivider = true,
  children
}: {
  title: string | React.ReactNode
  desc: string
  icon: string
  vertical?: boolean
  tooltip?: React.ReactNode
  hasDivider?: boolean
  children: React.ReactNode
}): React.ReactElement {
  return (
    <>
      <div
        className={`flex-between flex w-full flex-col gap-6 px-4 ${
          !vertical ? 'md:flex-row' : ''
        }`}
      >
        <div className="flex w-full items-center gap-4">
          <Icon icon={icon} className="size-6 text-bg-500" />
          <div>
            <h3 className="flex w-full items-center gap-2 text-xl font-medium leading-normal md:w-auto">
              {title}
              {tooltip !== undefined && (
                <a data-tooltip-id={`tooltip-${toDashCase(title)}`}>
                  <Icon
                    icon="tabler:info-circle"
                    className="size-5 text-bg-500"
                  />
                </a>
              )}
            </h3>
            <p className="text-bg-500">{desc}</p>
          </div>
        </div>
        <div className="flex-between flex w-full gap-4 md:w-auto">
          {children}
        </div>
        {tooltip !== undefined && (
          <Tooltip
            id={`tooltip-${toDashCase(title)}`}
            className="z-[9999] !rounded-md bg-bg-50 !p-4 !text-base text-bg-800 shadow-custom dark:bg-bg-900 dark:text-bg-100"
            classNameArrow="!size-6"
            place="top-start"
            positionStrategy="fixed"
            opacity={1}
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
