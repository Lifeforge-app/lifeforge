import { Icon } from '@iconify/react'
import * as Select from '@radix-ui/react-select'
import clsx from 'clsx'

import { useListboxContext } from './ListboxContext'

// We'll need to get the current value from context or pass it as a prop
// For now, let's pass it as a prop
function ListboxOption({
  value,
  label,
  icon,
  iconAtEnd = false,
  color,
  noCheckmark = false,
  className,
  renderColorAndIcon,
  style,
  selected
}: {
  value: unknown
  label: string | React.ReactElement
  icon?: string | React.ReactElement
  iconAtEnd?: boolean
  color?: string
  noCheckmark?: boolean
  className?: string
  renderColorAndIcon?: (params: {
    color?: string
    icon?: string | React.ReactElement
  }) => React.ReactNode
  style?: React.CSSProperties
  selected?: boolean
}) {
  const { currentValue, multiple } = useListboxContext()

  // Convert value to string for Radix UI Select
  const stringValue =
    typeof value === 'object' && value !== null
      ? JSON.stringify(value)
      : String(value || '<null>')

  // Check if this option is selected when in multiple mode
  const isSelected =
    multiple && Array.isArray(currentValue)
      ? currentValue.some(
          v =>
            (typeof v === 'object' && v !== null
              ? JSON.stringify(v)
              : String(v)) === stringValue
        )
      : selected !== undefined
        ? selected
        : (typeof currentValue === 'object' && currentValue !== null
            ? JSON.stringify(currentValue)
            : String(currentValue)) === stringValue

  return (
    <Select.Item
      className={clsx(
        'flex-between hover:bg-bg-200 dark:hover:bg-bg-700/50 data-[highlighted]:bg-bg-200 dark:data-[highlighted]:bg-bg-700/50 relative flex w-full min-w-0 cursor-pointer gap-4 rounded-lg p-5 transition-all outline-none select-none',
        className
      )}
      style={style}
      value={stringValue}
    >
      <div
        className={clsx(
          'flex w-full min-w-0 items-center',
          color !== undefined ? 'gap-3' : 'gap-2',
          isSelected && 'text-bg-800 dark:text-bg-100 font-semibold',
          iconAtEnd && 'flex-between flex flex-row-reverse'
        )}
      >
        {renderColorAndIcon ? (
          renderColorAndIcon({ color, icon })
        ) : icon !== undefined ? (
          <span
            className={clsx('shrink-0 rounded-md', color ? 'p-2' : 'pr-2')}
            style={
              color !== undefined
                ? {
                    backgroundColor: color + '20',
                    color
                  }
                : {}
            }
          >
            {typeof icon === 'string' ? (
              <Icon className="size-5 shrink-0" icon={icon} />
            ) : (
              icon
            )}
          </span>
        ) : (
          color !== undefined && (
            <span
              className="border-bg-200 dark:border-bg-700 block size-4 shrink-0 rounded-full border"
              style={{ backgroundColor: color }}
            />
          )
        )}
        <Select.ItemText className="w-full min-w-0 truncate">
          {label}
        </Select.ItemText>
      </div>
      {!noCheckmark && isSelected && (
        <Icon
          className="text-bg-800 dark:text-bg-100 block shrink-0 text-lg"
          icon="tabler:check"
        />
      )}
    </Select.Item>
  )
}

export default ListboxOption
