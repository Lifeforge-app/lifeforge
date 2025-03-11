import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'

import useThemeColors from '@hooks/useThemeColor'

interface SystemStatusCardProps {
  icon: string
  title: string
  value: number
  unit: string
  colorThresholds?: { high: number; medium: number }
  description: string
}

export function SystemStatusCard({
  icon,
  title,
  value,
  unit,
  colorThresholds,
  description
}: SystemStatusCardProps): React.ReactElement {
  const { componentBg, componentBgLighter } = useThemeColors()

  let colorClass = 'bg-green-500'

  if (value > (colorThresholds?.high ?? 80)) {
    colorClass = 'bg-red-500'
  } else if (value > (colorThresholds?.medium ?? 60)) {
    colorClass = 'bg-yellow-500'
  }

  return (
    <div
      className={clsx('shadow-custom space-y-4 rounded-lg p-6', componentBg)}
    >
      <div className="flex-between flex">
        <div className="flex items-center gap-2">
          <Icon className="text-bg-500 text-2xl" icon={icon} />
          <h2 className="text-bg-500 text-xl">{title}</h2>
        </div>
        <p className="border-bg-400 text-bg-500 shrink-0 rounded-md border px-4 py-2 text-lg">
          {value.toFixed(2)} {unit}
        </p>
      </div>
      <div
        className={clsx(
          'h-2 w-full overflow-hidden rounded-full',
          componentBgLighter
        )}
      >
        <div
          className={clsx('h-full rounded-full transition-all', colorClass)}
          style={{ width: `${(value / 100) * 100}%` }}
        ></div>
      </div>
      <p className="text-bg-500 text-center text-lg">{description}</p>
    </div>
  )
}
