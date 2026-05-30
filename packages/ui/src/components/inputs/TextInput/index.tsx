import { memo, useRef, useState } from 'react'

import { usePromiseLoading } from '@lifeforge/shared'

import { Flex } from '@/components/primitives'

import { Button } from '../Button'
import { InputIcon } from '../shared/components/InputIcon'
import { InputLabel } from '../shared/components/InputLabel'
import { InputWrapper } from '../shared/components/InputWrapper'
import { useInputLabel } from '../shared/hooks/useInputLabel'
import type { InputVariants } from '../shared/types'
import { TextInputBox } from './components/TextInputBox'

type TextInputProps = {
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
} & Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'> &
  InputVariants<true>

export function _TextInput({
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
      <Flex align="center" gap="sm" position="relative" width="100%">
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
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault()
              e.stopPropagation()

              handleClick()
            }}
          />
        )}
      </Flex>
    </InputWrapper>
  )
}

export const TextInput = memo(_TextInput)
