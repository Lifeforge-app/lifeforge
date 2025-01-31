import React, { memo, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import Button from '../../buttons/Button'
import InputActionButton from '../shared/InputActionButton'
import InputBox from '../shared/InputBox'
import InputIcon from '../shared/InputIcon'
import InputLabel from '../shared/InputLabel'
import InputWrapper from '../shared/InputWrapper'

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
  noAutoComplete?: boolean
  onActionButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  ref?: React.RefObject<HTMLInputElement | null>
  required?: boolean
  namespace: string | false
  tKey?: string
}

function TextInput({
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
  noAutoComplete = true,
  onActionButtonClick = () => {},
  onKeyDown = () => {},
  placeholder,
  ref,
  required,
  updateValue,
  value,
  namespace,
  tKey
}: IInputProps): React.ReactElement {
  const { t } = useTranslation(namespace ? namespace : undefined)
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

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
          required={required === true}
          label={
            namespace !== false
              ? t([
                  `inputs.${toCamelCase(name)}.label`,
                  `inputs.${toCamelCase(name)}`,
                  `${tKey}.inputs.${toCamelCase(name)}.label`,
                  `${tKey}.inputs.${toCamelCase(name)}`
                ])
              : name
          }
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

export default memo(TextInput)
