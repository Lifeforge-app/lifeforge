/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import React from 'react'
import CurrencyInput from 'react-currency-input-field'

function CurrencyInputComponent({
  name,
  placeholder,
  icon,
  value,
  updateValue,
  darker = false,
  additionalClassName = ''
}: {
  reference?: React.RefObject<HTMLInputElement>
  name: string
  placeholder: string
  icon: string
  value: string | undefined
  updateValue: (value: string | undefined) => void
  darker?: boolean
  additionalClassName?: string
}): React.ReactElement {
  return (
    <div
      className={`group relative flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 ${
        darker ? 'dark:bg-bg-800/50' : 'dark:bg-bg-800'
      } ${additionalClassName}`}
    >
      <Icon
        icon={icon}
        className={`ml-6 h-6 w-6 shrink-0 ${
          value ? '' : 'text-bg-500'
        } group-focus-within:!text-custom-500`}
      />
      <div className="flex w-full items-center gap-2">
        <span
          className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 transition-all group-focus-within:!text-custom-500 ${
            !value
              ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
              : 'top-6 -translate-y-1/2 text-[14px]'
          }`}
        >
          {name}
        </span>
        <CurrencyInput
          name={name}
          placeholder={placeholder}
          decimalsLimit={2}
          onValueChange={updateValue}
          className={
            'mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wider placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500'
          }
        />
      </div>
    </div>
  )
}

export default CurrencyInputComponent
