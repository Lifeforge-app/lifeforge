/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import CurrencyInput from 'react-currency-input-field'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import InputIcon from './Input/components/InputIcon'
import InputLabel from './Input/components/InputLabel'
import InputWrapper from './Input/components/InputWrapper'

function CurrencyInputComponent({
  name,
  placeholder,
  icon,
  value,
  updateValue,
  darker = false,
  className = '',
  required
}: {
  reference?: React.RefObject<HTMLInputElement | null>
  name: string
  placeholder: string
  icon: string
  value: string | undefined
  updateValue: (value: string | undefined) => void
  darker?: boolean
  className?: string
  required?: boolean
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <InputWrapper darker={darker} className={className}>
      <InputIcon icon={icon} active={!!value} />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          label={t(`input.${toCamelCase(name)}`)}
          active={!!value}
          required={required === true}
        />
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
