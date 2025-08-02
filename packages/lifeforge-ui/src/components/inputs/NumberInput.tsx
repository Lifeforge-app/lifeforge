import { useEffect, useState } from 'react'

import TextInput from './TextInput'

interface NumberInputProps {
  label: string
  icon: string
  value: number
  setValue: (value: number) => void
  required?: boolean
  disabled?: boolean
  className?: string
  namespace: string | false
  tKey?: string
}

function NumberInput({
  label,
  icon,
  value,
  setValue,
  required = false,
  disabled = false,
  className,
  namespace,
  tKey
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
      tKey={tKey}
      value={currentStringValue}
      onBlur={() => {
        const numericValue = parseInt(currentStringValue)

        if (!isNaN(numericValue)) {
          setValue(numericValue)
        } else {
          setValue(0)
        }
      }}
    />
  )
}

export default NumberInput
