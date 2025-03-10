import { Icon } from '@iconify/react'
import clsx from 'clsx'
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
      className={clsx(
        'shadow-custom mt-4 flex items-center gap-2 rounded-md p-2',
        componentBg,
        className
      )}
    >
      {options.map(({ value, icon }) => (
        <button
          key={value}
          className={clsx(
            'flex items-center gap-2 rounded-md p-2 transition-all',
            value === viewMode
              ? componentBgLighter
              : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
          )}
          onClick={() => {
            setViewMode(value)
          }}
        >
          <Icon className="size-6" icon={icon} />
        </button>
      ))}
    </div>
  )
}

export default ViewModeSelector
