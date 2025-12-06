import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import CurrencyInput from 'react-currency-input-field'

import InputIcon from './shared/components/InputIcon'
import InputLabel from './shared/components/InputLabel'
import InputWrapper from './shared/components/InputWrapper'
import useInputLabel from './shared/hooks/useInputLabel'
import { autoFocusableRef } from './shared/utils/autoFocusableRef'

interface CurrencyInputProps {
  currency?: string
  /** The style type of the input field. 'classic' shows label and icon with underline, 'plain' is a simple rounded box. */
  variant?: 'classic' | 'plain'
  /** The label text displayed above the currency input field. Required for 'classic' style. */
  label?: string
  /** The icon to display in the input field. Should be a valid icon name from Iconify. Required for 'classic' style. */
  icon?: string
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
  currency,
  variant = 'classic',
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
  const inputLabel = useInputLabel({ namespace, label: label ?? '' })

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
      variant={variant}
    >
      {variant === 'classic' && icon && (
        <InputIcon active={!!innerValue} hasError={!!errorMsg} icon={icon} />
      )}
      <div className="flex w-full items-center gap-2">
        {variant === 'classic' && label && (
          <InputLabel
            active={!!innerValue}
            hasError={!!errorMsg}
            label={inputLabel}
            required={required === true}
          />
        )}
        <div
          className={clsx(
            'flex-between gap-2',
            variant === 'classic' ? 'mt-6 h-8 p-6 pl-4' : 'h-7 p-0'
          )}
        >
          {currency && (
            <span className="text-bg-400 dark:text-bg-600">{currency}</span>
          )}
          <CurrencyInput
            ref={autoFocusableRef(autoFocus, inputRef)}
            className={clsx(
              'focus:placeholder:text-bg-500 w-full rounded-lg bg-transparent tracking-wider focus:outline-hidden',
              variant === 'classic' && 'placeholder:text-transparent'
            )}
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
      </div>
    </InputWrapper>
  )
}

export default CurrencyInputComponent
