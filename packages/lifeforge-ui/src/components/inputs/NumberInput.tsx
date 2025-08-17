/* eslint-disable jsx-a11y/no-autofocus */
import { useEffect, useState } from 'react'

import TextInput from './TextInput'

interface NumberInputProps {
  /** The label text displayed above the number input field. */
  label: string
  /** The icon to display in the input field. Should be a valid icon name from Iconify. */
  icon: string
  /** The current numeric value of the input. */
  value: number
  /** Callback function called when the input value changes. */
  setValue: (value: number) => void
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
}

function NumberInput({
  label,
  icon,
  value,
  setValue,
  required = false,
  disabled = false,
  autoFocus = false,
  className,
  namespace,
  errorMsg
}: NumberInputProps) {
  const [currentStringValue, setCurrentStringValue] = useState<string>(
    value.toString() === '0' ? '' : value.toString()
  )

  useEffect(() => {
    setCurrentStringValue(value.toString() === '0' ? '' : value.toString())
  }, [value])

  return (
    <TextInput
      autoFocus={autoFocus}
      className={className}
      disabled={disabled}
      errorMsg={errorMsg}
      icon={icon}
      inputMode="numeric"
      label={label}
      namespace={namespace}
      placeholder="123"
      required={required}
      setValue={(value: string) => {
        setCurrentStringValue(value)
      }}
      value={currentStringValue}
      onBlur={() => {
        if (currentStringValue.trim() === '') {
          setValue(0)

          return
        }

        //negative value as well
        if (!currentStringValue.match(/^(-?)\d*\.?\d*$/)) {
          setValue(value)
          setCurrentStringValue(
            value.toString() === '0' ? '' : value.toString()
          )

          return
        }

        const numericValue = currentStringValue.includes('.')
          ? parseFloat(currentStringValue)
          : parseInt(currentStringValue)

        setValue(numericValue)
      }}
    />
  )
}

export default NumberInput
