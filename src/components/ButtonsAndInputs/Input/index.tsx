/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import InputLabel from './components/InputLabel'
import InputWrapper from './components/InputWrapper'

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
  noAutoComplete = true,
  autoFocus = false,
  actionButtonIcon = '',
  onActionButtonClick = () => {},
  actionButtonLoading = false,
  needTranslate = true,
  disabled = false
}: {
  reference?: React.RefObject<HTMLInputElement | null>
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
  actionButtonLoading?: boolean
  needTranslate?: boolean
  disabled?: boolean
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <InputWrapper
      darker={darker}
      additionalClassName={additionalClassName}
      disabled={disabled}
    >
      <Icon
        icon={icon}
        className={`ml-6 size-6 shrink-0 ${
          value ? '' : 'text-bg-500'
        } group-focus-within:!text-custom-500`}
      />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          label={needTranslate ? t(`input.${toCamelCase(name)}`) : name}
          active={value.length > 0}
        />
        {isPassword && (
          <input type="password" hidden value="" onChange={() => {}} />
        )}
        <input
          ref={reference}
          disabled={disabled}
          value={value}
          onChange={updateValue}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          type={isPassword ? 'password' : 'text'}
          autoComplete={noAutoComplete ? 'false' : 'true'}
          style={isPassword ? { fontFamily: 'Arial' } : {}}
          className={`mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wider placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500 ${
            isPassword && value ? 'text-2xl focus:text-base' : ''
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
            tabIndex={-1}
            disabled={actionButtonLoading}
            onClick={onActionButtonClick}
            className="mr-4 shrink-0 rounded-lg p-2 text-bg-500 hover:bg-bg-200 hover:text-bg-200 focus:outline-none"
          >
            <Icon icon={actionButtonIcon} className="size-6" />
          </button>
        )}
      </div>
    </InputWrapper>
  )
}

export default Input
