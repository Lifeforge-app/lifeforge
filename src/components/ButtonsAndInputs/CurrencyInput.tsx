/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import CurrencyInput from 'react-currency-input-field'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import InputIcon from './Input/components/InputIcon'
import InputWrapper from './Input/components/InputWrapper'

function CurrencyInputComponent({
  name,
  placeholder,
  icon,
  value,
  updateValue,
  darker = false,
  className = ''
}: {
  reference?: React.RefObject<HTMLInputElement | null>
  name: string
  placeholder: string
  icon: string
  value: string | undefined
  updateValue: (value: string | undefined) => void
  darker?: boolean
  className?: string
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <InputWrapper darker={darker} className={className}>
      <InputIcon icon={icon} active={!!value} />
      <div className="flex w-full items-center gap-2">
        <span
          className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 transition-all group-focus-within:!text-custom-500 ${
            !value
              ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
              : 'top-6 -translate-y-1/2 text-[14px]'
          }`}
        >
          {t(`input.${toCamelCase(name)}`)}
        </span>
        <CurrencyInput
          name={name}
          placeholder={placeholder}
          decimalsLimit={2}
          value={value}
          onValueChange={updateValue}
          className={
            'mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wider placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500'
          }
        />
      </div>
    </InputWrapper>
  )
}

export default CurrencyInputComponent
