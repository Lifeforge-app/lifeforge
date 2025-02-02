import React from 'react'
import ConfigColumn from '@components/utilities/ConfigColumn'

function AdjustmentColumn({
  icon,
  title,
  desc,
  value,
  setValue,
  labels,
  max,
  needDivider = true
}: {
  icon: string
  title: string
  desc: string
  value: number
  setValue: (value: number) => void
  labels: string[]
  max: number
  needDivider?: boolean
}): React.ReactElement {
  return (
    <ConfigColumn
      noDefaultBreakpoints
      desc={desc}
      hasDivider={needDivider}
      icon={icon}
      title={title}
    >
      <div className="w-full">
        <input
          className="range range-primary w-full bg-bg-200 dark:bg-bg-800"
          max={max}
          min={0}
          step={1}
          type="range"
          value={value}
          onChange={e => {
            setValue(parseInt(e.target.value, 10))
          }}
        />
        <div className="mb-4 flex w-full justify-between px-2.5 text-xs">
          {labels.map((label, index) => (
            <div
              key={`title-${label}-${index}`}
              className="relative h-2 w-0.5 rounded-full bg-bg-500"
            >
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-bg-500">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ConfigColumn>
  )
}

export default AdjustmentColumn
