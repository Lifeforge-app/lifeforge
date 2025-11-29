import { useEffect, useRef, useState } from 'react'
import CurrencyInput from 'react-currency-input-field'

import InputIcon from './shared/components/InputIcon'
import InputLabel from './shared/components/InputLabel'
import InputWrapper from './shared/components/InputWrapper'
import useInputLabel from './shared/hooks/useInputLabel'
import { autoFocusableRef } from './shared/utils/autoFocusableRef'

interface CurrencyInputProps {
  /** The label text displayed above the currency input field. */
  label: string
  /** The icon to display in the input field. Should be a valid icon name from Iconify. */
  icon: string
  /** The placeholder text displayed when the input is empty. */
  placeholder: string
  /** The current numeric value of the currency input. */
  value: number
  /** Callback function called when the input value changes. */
  onChange: (number: number) => void
  /** Whether the currency input field is required for form validation. */
  required?: boolean
  /** Whether the currency input field is disabled and non-interactive. */
  disabled?: boolean
  /** Whether the input should automatically focus when rendered. */
  autoFocus?: boolean
  /** Additional CSS class names to apply to the currency input component. */
  className?: string
  /** The i18n namespace for internationalization. Use false to disable translation. */
  namespace?: string
  /** Error message to display when the input is invalid. */
  errorMsg?: string
}

/** CurrencyInputComponent for entering currency values with two decimal places and comma-separated thousands. */
function CurrencyInputComponent({
  label,
  icon,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  autoFocus = false,
  className,
  namespace,
  errorMsg
}: CurrencyInputProps) {
  const inputLabel = useInputLabel({ namespace, label })

  const [innerValue, setInnerValue] = useState(
    value.toString() === '0' ? '' : value.toString()
  )

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInnerValue(value.toString() === '0' ? '' : value.toString())
  }, [value])

  return (
    <InputWrapper
      className={className}
      disabled={disabled}
      errorMsg={errorMsg}
      inputRef={inputRef}
    >
      <InputIcon active={!!innerValue} hasError={!!errorMsg} icon={icon} />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          active={!!innerValue}
          hasError={!!errorMsg}
          label={inputLabel}
          required={required === true}
        />
        <CurrencyInput
          ref={autoFocusableRef(autoFocus, inputRef)}
          className="focus:placeholder:text-bg-500 mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wider placeholder:text-transparent focus:outline-hidden"
          decimalsLimit={2}
          name={label}
          placeholder={placeholder}
          value={innerValue}
          onBlur={() => {
            const numericValue = parseFloat(innerValue)

            if (!isNaN(numericValue)) {
              onChange(numericValue)
            } else {
              onChange(0)
            }
          }}
          onValueChange={value => setInnerValue(value || '')}
        />
      </div>
    </InputWrapper>
  )
}

export default CurrencyInputComponent
