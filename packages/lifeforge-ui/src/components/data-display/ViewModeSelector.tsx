import { Icon } from '@iconify/react'
import clsx from 'clsx'

export interface ViewModeSelectorProps<
  T extends ReadonlyArray<{ value: string; icon?: string; text?: string }>,
  TKey = T[number]['value']
> {
  /** The current selected mode */
  currentMode: TKey
  size?: 'small' | 'default'
  /** Callback when the mode is changed */
  onModeChange: (value: TKey) => void
  /** An array of objects representing the available view modes */
  options: T
  /** Additional class name for the container */
  className?: string
}

/**
 * A view mode selector for switching between different view modes. Nothing too fancy.
 */
function ViewModeSelector<
  T extends ReadonlyArray<{ value: string; icon?: string; text?: string }>,
  TKey = T[number]['value']
>({
  currentMode,
  size = 'default',
  onModeChange,
  options,
  className
}: ViewModeSelectorProps<T, TKey>) {
  return (
    <div
      className={clsx(
        'shadow-custom component-bg bg-bg-50 border-bg-500/20 flex items-center gap-2 rounded-lg in-[.bordered]:border-2',
        size === 'small' ? 'p-1' : 'p-2',
        className
      )}
    >
      {options.map(({ value, icon, text }) => (
        <button
          key={value}
          className={clsx(
            'flex-center flex-1 gap-2 rounded-md transition-all',
            size === 'small' ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-base',
            value === currentMode
              ? 'bg-bg-200/50 dark:bg-bg-800 shadow-custom border-bg-500/20 font-semibold in-[.bordered]:border-2'
              : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
          )}
          onClick={() => {
            onModeChange(value as TKey)
          }}
        >
          {icon && <Icon className="size-6" icon={icon} />}
          {text && <span>{text}</span>}
        </button>
      ))}
    </div>
  )
}

export default ViewModeSelector
