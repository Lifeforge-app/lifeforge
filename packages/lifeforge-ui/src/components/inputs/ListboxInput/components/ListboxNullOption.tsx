import { Icon } from '@iconify/react'
import * as Select from '@radix-ui/react-select'
import clsx from 'clsx'

import { useListboxContext } from './ListboxContext'

function ListboxNullOption({
  icon,
  value = '',
  hasBgColor = false,
  text = 'None'
}: {
  icon: string
  value?: unknown
  hasBgColor?: boolean
  text?: string
}) {
  const { currentValue, multiple } = useListboxContext()

  // Convert value to string for Radix UI Select
  const stringValue =
    typeof value === 'object' && value !== null
      ? JSON.stringify(value)
      : String(value || '')

  // Check if this option is selected when in multiple mode
  const isSelected =
    multiple && Array.isArray(currentValue)
      ? currentValue.some(
          v =>
            (typeof v === 'object' && v !== null
              ? JSON.stringify(v)
              : String(v)) === stringValue
        )
      : false // For null option, we typically check if no value is selected

  return (
    <Select.Item
      key="none"
      className="flex-between hover:bg-bg-200 dark:hover:bg-bg-700/50 data-[highlighted]:bg-bg-200 dark:data-[highlighted]:bg-bg-700/50 relative flex cursor-pointer p-4 transition-all outline-none select-none"
      value={stringValue}
    >
      <div
        className={clsx(
          'flex items-center font-medium',
          hasBgColor ? 'gap-3' : 'gap-2',
          isSelected && 'text-bg-800 dark:text-bg-100'
        )}
      >
        <span
          className={clsx(
            'rounded-md',
            hasBgColor ? 'bg-bg-200 text-bg-500 dark:bg-bg-700/50 p-2' : 'pr-2'
          )}
        >
          <Icon className="size-5" icon={icon} />
        </span>
        <Select.ItemText>{text}</Select.ItemText>
      </div>
      {(multiple ? isSelected : true) && (
        <Select.ItemIndicator>
          <Icon className="text-custom-500 block text-lg" icon="tabler:check" />
        </Select.ItemIndicator>
      )}
    </Select.Item>
  )
}

export default ListboxNullOption
