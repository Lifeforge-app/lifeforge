import { useEffect, useState } from 'react'
import CurrencyInput from 'react-currency-input-field'

import InputIcon from './shared/components/InputIcon'
import InputLabel from './shared/components/InputLabel'
import InputWrapper from './shared/components/InputWrapper'
import useInputLabel from './shared/hooks/useInputLabel'

function CurrencyInputComponent({
  name,
  placeholder,
  disabled = false,
  icon,
  value,
  setValue,
  darker = false,
  className = '',
  required,
  namespace
}: {
  reference?: React.RefObject<HTMLInputElement | null>
  name: string
  disabled?: boolean
  placeholder: string
  icon: string
  value: number
  setValue: (number: number) => void
  darker?: boolean
  className?: string
  required?: boolean
  namespace: string | false
}) {
  const inputLabel = useInputLabel(namespace, name)

  const [innerValue, setInnerValue] = useState(
    value.toString() === '0' ? '' : value.toString()
  )

  useEffect(() => {
    setInnerValue(value.toString() === '0' ? '' : value.toString())
  }, [value])

  return (
    <InputWrapper className={className} darker={darker} disabled={disabled}>
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
          name={name}
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
