import { Icon } from '@iconify/react'
import React from 'react'
import useThemeColors from '@hooks/useThemeColor'

function ViewModeSelector<T extends string>({
  viewMode,
  setViewMode,
  options,
  className
}: {
  viewMode: T
  setViewMode: (value: T) => void
  options: Array<{ value: T; icon: string }>
  className?: string
}): React.ReactElement {
  const { componentBg, componentBgLighter } = useThemeColors()

  return (
    <div
      className={`mt-4 flex items-center gap-2 rounded-md p-2 shadow-custom ${componentBg} ${className}`}
    >
      {options.map(({ value, icon }) => (
        <button
          key={value}
          onClick={() => {
            setViewMode(value)
          }}
          className={`flex items-center gap-2 rounded-md p-2 transition-all ${
            value === viewMode
              ? componentBgLighter
              : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
          }`}
        >
          <Icon icon={icon} className="size-6" />
        </button>
      ))}
    </div>
  )
}

export default ViewModeSelector
