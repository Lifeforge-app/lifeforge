import React from 'react'
import CurrencyInput from 'react-currency-input-field'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import InputIcon from './shared/InputIcon'
import InputLabel from './shared/InputLabel'
import InputWrapper from './shared/InputWrapper'

function CurrencyInputComponent({
  name,
  placeholder,
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
  placeholder: string
  icon: string
  value: string | undefined
  setValue: (value: string) => void
  darker?: boolean
  className?: string
  required?: boolean
  namespace: string
}): React.ReactElement {
  const { t } = useTranslation(namespace)

  return (
    <InputWrapper className={className} darker={darker}>
      <InputIcon active={!!value} icon={icon} />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          active={!!value}
          label={t(`inputs.${toCamelCase(name)}`)}
          required={required === true}
        />
        <CurrencyInput
          className={
            'mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wider placeholder:text-transparent focus:outline-hidden focus:placeholder:text-bg-500'
          }
          decimalsLimit={2}
          name={name}
          placeholder={placeholder}
          value={value}
          onValueChange={value => setValue(value ?? '')}
        />
      </div>
    </InputWrapper>
  )
}

export default CurrencyInputComponent
