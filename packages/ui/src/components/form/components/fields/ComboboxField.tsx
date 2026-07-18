import { useState } from 'react'
import {
  type Control,
  type FieldPathByValue,
  type FieldValues,
  useController
} from 'react-hook-form'

import { ComboboxInput, ComboboxOption } from '@/components/inputs'

import { useNamespace } from '../FormModal'

export function ComboboxField<TFieldValues extends FieldValues, TOption>({
  control,
  name,
  icon,
  label,
  disabled = false,
  namespace,
  required = false,
  options,
  autoFocus = false,
  forcedActiveWhen,
  className,
  onEnter,
  displayValue,
  onQueryChanged
}: {
  control: Control<TFieldValues>
  name: FieldPathByValue<TFieldValues, TOption | null | undefined>
  icon?: string
  label: string
  disabled?: boolean
  namespace?: string | false
  required?: boolean
  options: {
    value: TOption
    text: string
    icon?: string
    color?: string
  }[]
  autoFocus?: boolean
  forcedActiveWhen?: boolean
  className?: string
  onEnter?: () => void
  displayValue?: (value: TOption) => string
  onQueryChanged?: (query: string) => void
}) {
  const { field, fieldState } = useController({
    control,
    name
  })

  const contextNamespace = useNamespace()

  const activeNamespace = namespace ?? contextNamespace

  const [internalQuery, setInternalQuery] = useState('')

  function handleQueryChange(q: string) {
    setInternalQuery(q)
    if (onQueryChanged) {
      onQueryChanged(q)
    }
  }

  function defaultDisplayValue(val: TOption) {
    if (val === undefined || val === null) {
      return ''
    }
    const target = options.find(opt => {
      if (opt.value === val) return true
      try {
        return JSON.stringify(opt.value) === JSON.stringify(val)
      } catch {
        return false
      }
    })
    return target?.text ?? ''
  }

  const activeDisplayValue = displayValue ?? defaultDisplayValue

  const filteredOptions = onQueryChanged
    ? options
    : internalQuery === ''
      ? options
      : options.filter(opt =>
          opt.text.toLowerCase().includes(internalQuery.toLowerCase())
        )

  function handleComboboxChange(val: TOption) {
    field.onChange(val)
  }

  return (
    <ComboboxInput<TOption>
      autoFocus={autoFocus}
      className={className}
      disabled={disabled}
      displayValue={activeDisplayValue}
      errorMsg={fieldState.error?.message}
      forcedActiveWhen={forcedActiveWhen}
      icon={icon}
      label={label}
      namespace={activeNamespace}
      required={required}
      value={field.value}
      onChange={handleComboboxChange}
      onQueryChanged={handleQueryChange}
      onEnter={onEnter}
    >
      {filteredOptions.map(option => (
        <ComboboxOption
          key={String(option.value)}
          color={option.color}
          icon={option.icon}
          label={option.text}
          value={option.value}
        />
      ))}
    </ComboboxInput>
  )
}
