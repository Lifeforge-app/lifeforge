import React, { useEffect, useState } from 'react'

import TextInput from './TextInput'

function NumberInput({
  darker,
  className,
  value,
  setValue,
  namespace,
  name,
  placeholder,
  required = false,
  disabled = false,
  icon
}: {
  darker?: boolean
  className?: string
  value: number
  setValue: (value: number) => void
  namespace: string | false
  name: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  icon: string
}) {
  const [currentStringValue, setCurrentStringValue] = useState<string>(
    value.toString() === '0' ? '' : value.toString()
  )

  useEffect(() => {
    setCurrentStringValue(value.toString() === '0' ? '' : value.toString())
  }, [value])

  return (
    <TextInput
      className={className}
      darker={darker}
      disabled={disabled}
      icon={icon}
      inputMode="numeric"
      name={name}
      namespace={namespace}
      placeholder={placeholder || ''}
      required={required}
      setValue={(value: string) => {
        setCurrentStringValue(value)
      }}
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
