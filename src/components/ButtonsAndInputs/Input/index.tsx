/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { memo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import InputActionButton from './components/InputActionButton'
import InputBox from './components/InputBox'
import InputIcon from './components/InputIcon'
import InputLabel from './components/InputLabel'
import InputWrapper from './components/InputWrapper'
import Button from '../Button'

interface IInputProps {
  icon: string
  name: string
  placeholder: string
  value: string
  updateValue: (value: string) => void

  inputMode?:
    | 'text'
    | 'none'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search'
  actionButtonIcon?: string
  actionButtonLoading?: boolean
  autoFocus?: boolean
  className?: string
  darker?: boolean
  disabled?: boolean
  isPassword?: boolean
  needTranslate?: boolean
  noAutoComplete?: boolean
  onActionButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  ref?: React.RefObject<HTMLInputElement | null>
}

function Input({
  actionButtonIcon = '',
  actionButtonLoading = false,
  autoFocus = false,
  className = '',
  darker = false,
  disabled = false,
  icon,
  inputMode = 'text',
  isPassword = false,
  name,
  needTranslate = true,
  noAutoComplete = true,
  onActionButtonClick = () => {},
  onKeyDown = () => {},
  placeholder,
  ref,
  updateValue,
  value
}: IInputProps): React.ReactElement {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
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
          inputMode={inputMode}
          showPassword={showPassword}
          placeholder={placeholder}
          inputRef={inputRef}
          reference={ref}
          autoFocus={autoFocus}
          disabled={disabled}
          noAutoComplete={noAutoComplete}
          onKeyDown={onKeyDown}
        />
        {isPassword && (
          <Button
            variant="no-bg"
            className="mr-2"
            icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'}
            onMouseDown={() => {
              setShowPassword(true)
            }}
            onMouseUp={() => {
              setShowPassword(false)
            }}
            onTouchStart={() => {
              setShowPassword(true)
            }}
            onTouchEnd={() => {
              setShowPassword(false)
            }}
          />
        )}
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

export default memo(Input)
