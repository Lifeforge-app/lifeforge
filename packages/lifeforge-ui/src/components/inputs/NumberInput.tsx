import { useEffect, useState } from 'react'

import Button from './Button'
import TextInput from './TextInput'

interface NumberInputProps {
  /** The style type of the input field. 'classic' shows label and icon with underline, 'plain' is a simple rounded box. */
  variant?: 'classic' | 'plain'
  /** The label text displayed above the number input field. Required for 'classic' style. */
  label?: string
  /** The icon to display in the input field. Should be a valid icon name from Iconify. Required for 'classic' style. */
  icon?: string
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

function NumberInput({
  variant = 'classic',
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
}: NumberInputProps) {
  const [currentStringValue, setCurrentStringValue] = useState<string>(
    value.toString() === '0' ? '' : value.toString()
  )

  useEffect(() => {
    setCurrentStringValue(value.toString() === '0' ? '' : value.toString())
  }, [value])

  return (
    <TextInput
      actionButtonProps={actionButtonProps}
      autoFocus={autoFocus}
      className={className}
      disabled={disabled}
      errorMsg={errorMsg}
      icon={icon}
      inputMode="numeric"
      label={label}
      namespace={namespace}
      placeholder={placeholder}
      required={required}
      value={currentStringValue}
      variant={variant}
      onBlur={() => {
        if (currentStringValue.trim() === '') {
          onChange(0)

          return
        }

        //negative value as well
        if (!currentStringValue.match(/^(-?)\d*\.?\d*$/)) {
          onChange(value)
          setCurrentStringValue(
            value.toString() === '0' ? '' : value.toString()
          )

          return
        }

        let numericValue = currentStringValue.includes('.')
          ? parseFloat(currentStringValue)
          : parseInt(currentStringValue)

        if (min !== undefined && numericValue < min) {
          numericValue = min
        }

        if (max !== undefined && numericValue > max) {
          numericValue = max
        }

        onChange(numericValue)
      }}
      onChange={(value: string) => {
        setCurrentStringValue(value)
      }}
    />
  )
}

export default NumberInput
