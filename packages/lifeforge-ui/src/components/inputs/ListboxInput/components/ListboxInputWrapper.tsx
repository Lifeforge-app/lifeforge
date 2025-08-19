import * as Select from '@radix-ui/react-select'
import clsx from 'clsx'
import { useState } from 'react'

import { ListboxProvider } from './ListboxContext'

function ListboxInputWrapper<T>({
  value,
  onChange,
  multiple = false,
  className,
  children,
  disabled,
  onClick
}: {
  value: T
  onChange: (value: T) => void
  multiple?: boolean
  className?: string
  children: React.ReactNode
  disabled?: boolean
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  // Convert value to string for Radix UI Select
  const stringValue = Array.isArray(value)
    ? value.join(',')
    : typeof value === 'object' && value !== null
      ? JSON.stringify(value)
      : String(value || '')

  const handleValueChange = (newValue: string) => {
    if (multiple && Array.isArray(value)) {
      // For multiple selection, we need to handle adding/removing items
      const currentValues = value as unknown[]

      const newValueParsed = newValue

      // Check if the value is already selected
      const isSelected = currentValues.some(
        v =>
          (typeof v === 'object' && v !== null
            ? JSON.stringify(v)
            : String(v)) === newValue
      )

      let newValues: unknown[]

      if (isSelected) {
        // Remove the value
        newValues = currentValues.filter(
          v =>
            (typeof v === 'object' && v !== null
              ? JSON.stringify(v)
              : String(v)) !== newValue
        )
      } else {
        // Add the value
        // Try to parse back to original type if possible
        let parsedValue: unknown = newValueParsed

        try {
          if (
            newValueParsed.startsWith('{') ||
            newValueParsed.startsWith('[')
          ) {
            parsedValue = JSON.parse(newValueParsed)
          } else if (!isNaN(Number(newValueParsed))) {
            parsedValue = Number(newValueParsed)
          } else if (newValueParsed === 'true' || newValueParsed === 'false') {
            parsedValue = newValueParsed === 'true'
          }
        } catch {
          // Keep as string if parsing fails
        }

        newValues = [...currentValues, parsedValue]
      }

      onChange(newValues as T)
      // Keep the select open for multiple selection
      setTimeout(() => setIsOpen(true), 0)
    } else {
      // Single selection
      // Try to parse back to original type if needed
      if (typeof value === 'number') {
        onChange(Number(newValue) as T)
      } else if (typeof value === 'boolean') {
        onChange((newValue === 'true') as T)
      } else if (typeof value === 'object' && value !== null) {
        try {
          onChange(JSON.parse(newValue) as T)
        } catch {
          onChange(newValue as T)
        }
      } else {
        onChange(newValue as T)
      }

      setIsOpen(false)
    }
  }

  if (multiple) {
    // For multiple selection, we render a custom dropdown-like interface
    return (
      <ListboxProvider value={{ currentValue: value, multiple }}>
        <div
          className={clsx(
            'border-bg-400 dark:border-bg-600 bg-bg-200/50 shadow-custom hover:bg-bg-200 focus-within:border-custom-500! data-open:border-custom-500! dark:bg-bg-800/50 dark:hover:bg-bg-800/80 relative flex items-center gap-1 rounded-t-lg border-b-2 transition-all',
            className,
            disabled ? 'pointer-events-none! opacity-50' : '',
            isOpen && 'data-open'
          )}
          onClick={onClick}
        >
          <Select.Root
            disabled={disabled}
            open={isOpen}
            value=""
            onOpenChange={setIsOpen}
            onValueChange={handleValueChange}
          >
            {children}
          </Select.Root>
        </div>
      </ListboxProvider>
    )
  }

  return (
    <ListboxProvider value={{ currentValue: value, multiple }}>
      <Select.Root
        disabled={disabled}
        value={stringValue}
        onValueChange={handleValueChange}
      >
        <div
          className={clsx(
            'border-bg-400 dark:border-bg-600 bg-bg-200/50 shadow-custom hover:bg-bg-200 focus-within:border-custom-500! data-open:border-custom-500! dark:bg-bg-800/50 dark:hover:bg-bg-800/80 relative flex items-center gap-1 rounded-t-lg border-b-2 transition-all',
            className,
            disabled ? 'pointer-events-none! opacity-50' : ''
          )}
          onClick={onClick}
        >
          {children}
        </div>
      </Select.Root>
    </ListboxProvider>
  )
}

export default ListboxInputWrapper
