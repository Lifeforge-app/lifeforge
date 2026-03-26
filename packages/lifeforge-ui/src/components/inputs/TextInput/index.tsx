import { memo, useRef, useState } from 'react'
import { usePromiseLoading } from 'shared'

import Button from '../Button'
import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import InputWrapper from '../shared/components/InputWrapper'
import useInputLabel from '../shared/hooks/useInputLabel'
import { inputContentRowStyle } from '../shared/input.css'
import TextInputBox from './components/TextInputBox'

export type TextInputProps = {
  variant?: 'classic' | 'plain'
  size?: 'small' | 'default'
  label?: string
  icon?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  autoFocus?: boolean
  isPassword?: boolean
  inputMode?:
    | 'text'
    | 'none'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search'
  actionButtonProps?: React.ComponentProps<typeof Button>
  className?: string
  namespace?: string
  errorMsg?: string
} & Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'>

function TextInput({
  variant = 'classic',
  size = 'default',
  label,
  icon,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  isPassword = false,
  inputMode = 'text',
  actionButtonProps,
  className,
  namespace,
  errorMsg,
  autoFocus = false,
  ...inputProps
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const inputLabel = useInputLabel({ namespace, label: label ?? '' })

  const [actionButtonLoading, handleClick] = usePromiseLoading(
    (actionButtonProps?.onClick as () => Promise<void>) ||
      (async (): Promise<void> => {})
  )

  return (
    <InputWrapper
      className={className}
      disabled={disabled}
      errorMsg={errorMsg}
      inputRef={inputRef}
      size={size}
      variant={variant}
    >
      {variant === 'classic' && icon && (
        <InputIcon
          active={!!value && String(value).length > 0}
          hasError={!!errorMsg}
          icon={icon}
        />
      )}
      <div className={inputContentRowStyle}>
        {variant === 'classic' && label && (
          <InputLabel
            active={!!value && String(value).length > 0}
            hasError={!!errorMsg}
            label={inputLabel}
            required={required === true}
          />
        )}
        <TextInputBox
          autoFocus={autoFocus}
          disabled={disabled}
          inputMode={inputMode}
          inputRef={inputRef}
          isPassword={isPassword}
          placeholder={placeholder}
          showPassword={showPassword}
          size={size}
          value={value}
          variant={variant}
          onChange={onChange}
          {...inputProps}
        />
        {isPassword && (
          <Button
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
        {actionButtonProps && (
          <Button
            {...actionButtonProps}
            loading={actionButtonLoading}
            variant="plain"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()

              handleClick()
            }}
          />
        )}
      </div>
    </InputWrapper>
  )
}

export default memo(TextInput)
