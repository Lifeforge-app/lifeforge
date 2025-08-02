import { useEffect, useState } from 'react'
import CurrencyInput from 'react-currency-input-field'

import InputIcon from './shared/components/InputIcon'
import InputLabel from './shared/components/InputLabel'
import InputWrapper from './shared/components/InputWrapper'
import useInputLabel from './shared/hooks/useInputLabel'

interface CurrencyInputProps {
  label: string
  icon: string
  placeholder: string
  value: number
  setValue: (number: number) => void
  required?: boolean
  disabled?: boolean
  className?: string
  namespace: string | false
  tKey?: string
}

function CurrencyInputComponent({
  label,
  icon,
  placeholder,
  value,
  setValue,
  required,
  disabled,
  className,
  namespace,
  tKey
}: CurrencyInputProps) {
  const inputLabel = useInputLabel(namespace, label, tKey)

  const [innerValue, setInnerValue] = useState(
    value.toString() === '0' ? '' : value.toString()
  )

  useEffect(() => {
    setInnerValue(value.toString() === '0' ? '' : value.toString())
  }, [value])

  return (
    <InputWrapper className={className} disabled={disabled}>
      <InputIcon active={!!innerValue} icon={icon} />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          active={!!innerValue}
          label={inputLabel}
          required={required === true}
        />
        <CurrencyInput
          className="focus:placeholder:text-bg-500 mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wider placeholder:text-transparent focus:outline-hidden"
          decimalsLimit={2}
          name={label}
          placeholder={placeholder}
          value={innerValue}
          onBlur={() => {
            const numericValue = parseFloat(innerValue)

            if (!isNaN(numericValue)) {
              setValue(numericValue)
            } else {
              setValue(0)
            }
          }}
          onValueChange={value => setInnerValue(value || '')}
        />
      </div>
    </InputWrapper>
  )
}

export default CurrencyInputComponent
