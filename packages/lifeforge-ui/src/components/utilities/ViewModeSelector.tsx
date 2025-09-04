import { Icon } from '@iconify/react'
import clsx from 'clsx'

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
}) {
  return (
    <div
      className={clsx(
        'shadow-custom component-bg bg-bg-50 flex items-center gap-2 rounded-md p-3',
        className
      )}
    >
      {options.map(({ value, icon }) => (
        <button
          key={value}
          className={clsx(
            'flex items-center gap-2 rounded-md p-2 transition-all',
            value === viewMode
              ? 'component-bg-lighter'
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
