/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function Input({
  name,
  placeholder,
  icon,
  value,
  updateValue,
  isPassword = false,
  darker = false,
  additionalClassName = '',
  onKeyDown = () => {},
  noAutoComplete = false
}: {
  name: string
  placeholder: string
  icon: string
  value: string
  updateValue: (e: React.ChangeEvent<HTMLInputElement>) => void
  isPassword?: boolean
  darker?: boolean
  additionalClassName?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  noAutoComplete?: boolean
}): React.ReactElement {
  return (
    <div
      className={`group relative flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] focus-within:!border-custom-500 ${
        darker ? 'dark:bg-bg-800/50' : 'dark:bg-bg-800'
      } ${additionalClassName}`}
    >
      <Icon
        icon={icon}
        className={`ml-6 h-6 w-6 shrink-0 ${
          value ? 'text-bg-800 dark:text-bg-100' : 'text-bg-500'
        } group-focus-within:!text-custom-500`}
      />
      <div className="flex w-full items-center gap-2">
        <span
          className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 transition-all group-focus-within:!text-custom-500 ${
            value.length === 0
              ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
              : 'top-6 -translate-y-1/2 text-[14px]'
          }`}
        >
          {name}
        </span>
        <input
          type={isPassword ? 'password' : 'text'}
          value={value}
          onChange={updateValue}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          autoComplete={noAutoComplete ? 'false' : 'true'}
          className={`mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wider placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500 ${
            isPassword && 'text-2xl'
          }`}
        />
      </div>
    </div>
  )
}

export default Input
