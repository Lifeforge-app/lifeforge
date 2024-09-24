/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import InputLabel from './components/InputLabel'
import InputWrapper from './components/InputWrapper'

function Input({
  actionButtonIcon = '',
  actionButtonLoading = false,
  autoFocus = false,
  className = '',
  darker = false,
  disabled = false,
  icon,
  isPassword = false,
  name,
  needTranslate = true,
  noAutoComplete = true,
  onActionButtonClick = () => {},
  onKeyDown = () => {},
  placeholder,
  reference,
  updateValue,
  value
}: {
  actionButtonIcon?: string
  actionButtonLoading?: boolean
  autoFocus?: boolean
  className?: string
  darker?: boolean
  disabled?: boolean
  icon: string
  isPassword?: boolean
  name: string
  needTranslate?: boolean
  noAutoComplete?: boolean
  onActionButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder: string
  reference?: React.RefObject<HTMLInputElement | null>
  updateValue: (value: string) => void
  value: string
}): React.ReactElement {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <InputWrapper
      darker={darker}
      className={className}
      disabled={disabled}
      inputRef={inputRef}
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
          ref={ref => {
            if (reference) {
              reference.current = ref
            }
            inputRef.current = ref
          }}
          disabled={disabled}
          value={value}
          onChange={e => {
            updateValue(e.target.value)
          }}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          type={isPassword ? 'password' : 'text'}
          autoComplete={noAutoComplete ? 'false' : 'true'}
          style={isPassword ? { fontFamily: 'Arial' } : {}}
          className={`mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wider caret-custom-500 placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500 ${
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
