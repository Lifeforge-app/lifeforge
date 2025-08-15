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
  /** Additional CSS class names to apply to the number input component. */
  className?: string
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
}

function NumberInput({
  label,
  icon,
  value,
  setValue,
  required = false,
  disabled = false,
  className,
  namespace
}: NumberInputProps) {
  const [currentStringValue, setCurrentStringValue] = useState<string>(
    value.toString() === '0' ? '' : value.toString()
  )

  useEffect(() => {
    setCurrentStringValue(value.toString() === '0' ? '' : value.toString())
  }, [value])

  return (
    <TextInput
      className={className}
      disabled={disabled}
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

        const numericValue = parseInt(currentStringValue)

        if (!isNaN(numericValue)) {
          setValue(numericValue)
        } else {
          setValue(value)
          setCurrentStringValue(value.toString())
        }
      }}
    />
  )
}

export default NumberInput
