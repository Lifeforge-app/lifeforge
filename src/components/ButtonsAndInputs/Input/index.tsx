/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import InputActionButton from './components/InputActionButton'
import InputBox from './components/InputBox'
import InputIcon from './components/InputIcon'
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
      <InputIcon icon={icon} active={String(value).length > 0} />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          label={needTranslate ? t(`input.${toCamelCase(name)}`) : name}
          active={String(value).length > 0}
        />
        <InputBox
          value={value}
          updateValue={updateValue}
          isPassword={isPassword}
          placeholder={placeholder}
          inputRef={inputRef}
          reference={reference}
          autoFocus={autoFocus}
          disabled={disabled}
          noAutoComplete={noAutoComplete}
          onKeyDown={onKeyDown}
        />
        {actionButtonIcon && (
          <InputActionButton
            actionButtonLoading={actionButtonLoading}
            actionButtonIcon={actionButtonIcon}
            onActionButtonClick={onActionButtonClick}
          />
        )}
      </div>
    </InputWrapper>
  )
}

export default Input
