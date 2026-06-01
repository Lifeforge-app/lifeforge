import { useEffect, useRef } from 'react'
import { NumericFormat } from 'react-number-format'

import { Button } from '../Button'
import { TextInput } from '../TextInput'
import type { InputVariants } from '../shared/types'

export interface NumberInputProps {
  /** The label text displayed above the number input field. Required for 'classic' style. */
  label: string
  /** The icon to display in the input field. Should be a valid icon name from Iconify. Required for 'classic' style. */
  icon: string
  /** The current numeric value of the input. */
  value: number
  /** Callback function called when the input value changes. */
  onChange: (value: number) => void
  /** Whether the number input field is required for form validation. */
  required?: boolean
  /** Whether the number input field is disabled and non-interactive. */
  disabled?: boolean
  /** Whether the input should automatically focus when rendered. */
  autoFocus?: boolean
  /** Additional CSS class names to apply to the number input component. */
  className?: string
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
  /** Error message to display when the input is invalid. */
  errorMsg?: string
  /** The minimum value allowed. */
  min?: number
  /** The maximum value allowed. */
  max?: number
  /** The placeholder text shown when the input is empty. */
  placeholder?: string
  /** Properties for constructing the action button component at the right hand side. */
  actionButtonProps?: React.ComponentProps<typeof Button>
}

function NumberTextInputAdapter(props: any) {
  const { onChange, getInputRef, ...rest } = props

  const localRef = useRef<HTMLInputElement | null>(null)

  useEffect(function () {
    if (getInputRef) {
      if (typeof getInputRef === 'function') {
        getInputRef(localRef.current)
      } else {
        getInputRef.current = localRef.current
      }
    }
  })

  return (
    <TextInput
      {...rest}
      inputRef={localRef}
      onChange={function () {}}
      onRawChange={onChange}
    />
  )
}

export function NumberInput({
  variant = 'classic',
  size = 'default',
  label,
  icon,
  value,
  onChange,
  required = false,
  disabled = false,
  autoFocus = false,
  className,
  namespace,
  errorMsg,
  min,
  max,
  placeholder = '123',
  actionButtonProps
}: NumberInputProps & InputVariants<true>) {
  return (
    <NumericFormat
      actionButtonProps={actionButtonProps}
      autoFocus={autoFocus}
      className={className}
      customInput={NumberTextInputAdapter}
      disabled={disabled}
      errorMsg={errorMsg}
      icon={icon}
      label={label}
      namespace={namespace}
      placeholder={placeholder}
      required={required}
      size={size as never}
      value={value}
      variant={variant as never}
      onBlur={function () {
        let numericValue = value

        if (min !== undefined && numericValue < min) {
          numericValue = min
        }

        if (max !== undefined && numericValue > max) {
          numericValue = max
        }

        if (numericValue !== value) {
          onChange(numericValue)
        }
      }}
      onValueChange={function (values) {
        const numericValue = values.floatValue ?? 0

        onChange(numericValue)
      }}
    />
  )
}
