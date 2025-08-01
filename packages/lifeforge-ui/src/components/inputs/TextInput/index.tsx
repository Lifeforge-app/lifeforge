import { memo, useRef, useState } from 'react'

import { Button } from '../../buttons'
import InputActionButton from '../shared/components/InputActionButton'
import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import InputWrapper from '../shared/components/InputWrapper'
import useInputLabel from '../shared/hooks/useInputLabel'
import TextInputBox from './components/TextInputBox'

export interface ITextInputProps {
  icon: string
  name: string
  placeholder: string
  value: string
  setValue: (value: string) => void

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
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  ref?: React.RefObject<HTMLInputElement | null>
  required?: boolean
  namespace: string | false
  tKey?: string
}

function TextInput({
  actionButtonIcon = '',
  actionButtonLoading = false,
  className = '',
  darker = false,
  disabled = false,
  icon,
  inputMode = 'text',
  isPassword = false,
  name,
  noAutoComplete = true,
  onActionButtonClick = () => {},
  onBlur,
  onKeyDown = () => {},
  placeholder,
  ref,
  required,
  setValue,
  value,
  namespace,
  tKey
}: ITextInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const inputLabel = useInputLabel(namespace, name, tKey)

  return (
    <InputWrapper
      className={className}
      darker={darker}
      disabled={disabled}
      inputRef={inputRef}
    >
      <InputIcon active={!!value && String(value).length > 0} icon={icon} />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          active={!!value && String(value).length > 0}
          label={inputLabel}
          required={required === true}
        />
        <TextInputBox
          disabled={disabled}
          inputMode={inputMode}
          inputRef={inputRef}
          isPassword={isPassword}
          noAutoComplete={noAutoComplete}
          placeholder={placeholder}
          reference={ref}
          setValue={setValue}
          showPassword={showPassword}
          value={value}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
        {isPassword && (
          <Button
            className="mr-2"
            icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'}
            variant="plain"
            onMouseDown={() => {
              setShowPassword(true)
            }}
            onMouseUp={() => {
              setShowPassword(false)
            }}
            onTouchEnd={() => {
              setShowPassword(false)
            }}
            onTouchStart={() => {
              setShowPassword(true)
            }}
          />
        )}
        {actionButtonIcon && (
          <InputActionButton
            actionButtonIcon={actionButtonIcon}
            actionButtonLoading={actionButtonLoading}
            onActionButtonClick={onActionButtonClick}
          />
        )}
      </div>
    </InputWrapper>
  )
}

export default memo(TextInput)
