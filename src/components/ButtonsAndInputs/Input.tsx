/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import React from 'react'

function Input({
  reference,
  name,
  placeholder,
  icon,
  value,
  updateValue,
  isPassword = false,
  darker = false,
  additionalClassName = '',
  onKeyDown = () => {},
  noAutoComplete = false,
  autoFocus = false,
  actionButtonIcon = '',
  onActionButtonClick = () => {}
}: {
  reference?: React.RefObject<HTMLInputElement>
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
  autoFocus?: boolean
  actionButtonIcon?: string
  onActionButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
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
            value.length === 0
              ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
              : 'top-6 -translate-y-1/2 text-[14px]'
          }`}
        >
          {name}
        </span>
        <input
          ref={reference}
          type={isPassword ? 'password' : 'text'}
          value={value}
          onChange={updateValue}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          autoComplete={noAutoComplete ? 'false' : 'true'}
          className={`mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wider placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500 ${
            isPassword && value && 'text-2xl focus:text-base'
          }`}
          autoFocus={autoFocus}
          onFocus={e => {
            if (isPassword) {
              e.target.type = 'text'
            }
          }}
          onBlur={e => {
            if (isPassword) {
              e.target.type = 'password'
            }
          }}
        />
        {actionButtonIcon && (
          <button
            onClick={onActionButtonClick}
            className="mr-4 shrink-0 rounded-lg p-2 text-bg-500 hover:bg-bg-500/30 hover:text-bg-200 focus:outline-none"
          >
            <Icon icon={actionButtonIcon} className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Input
