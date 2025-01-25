import { Icon } from '@iconify/react'
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
    <div className={`space-y-4 rounded-lg p-6 shadow-custom ${componentBg}`}>
      <div className="flex-between flex">
        <div className="flex items-center gap-2">
          <Icon icon={icon} className="text-2xl text-bg-500" />
          <h2 className="text-xl text-bg-500">{title}</h2>
        </div>
        <p className="shrink-0 rounded-md border border-bg-400 px-4 py-2 text-lg text-bg-500">
          {value.toFixed(2)} {unit}
        </p>
      </div>
      <div
        className={`h-2 w-full overflow-hidden rounded-full ${componentBgLighter}`}
      >
        <div
          className={`h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${(value / 100) * 100}%` }}
        ></div>
      </div>
      <p className="text-center text-lg text-bg-500">{description}</p>
    </div>
  )
}
