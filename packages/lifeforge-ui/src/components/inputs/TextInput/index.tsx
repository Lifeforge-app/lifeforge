import { memo, useRef, useState } from 'react'

import { Button } from '../../buttons'
import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import InputWrapper from '../shared/components/InputWrapper'
import useInputLabel from '../shared/hooks/useInputLabel'
import TextInputBox from './components/TextInputBox'

export type TextInputProps = {
  label: string
  icon: string
  placeholder: string
  value: string
  setValue: (value: string) => void
  required?: boolean
  disabled?: boolean
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
  namespace: string | false
  tKey?: string
} & React.HTMLAttributes<HTMLInputElement>

function TextInput({
  label,
  icon,
  placeholder,
  value,
  setValue,
  required,
  disabled,
  isPassword = false,
  inputMode = 'text',
  actionButtonProps,
  className,
  namespace,
  tKey,
  ...inputProps
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const inputLabel = useInputLabel(namespace, label, tKey)

  return (
    <InputWrapper className={className} disabled={disabled} inputRef={inputRef}>
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
          placeholder={placeholder}
          setValue={setValue}
          showPassword={showPassword}
          value={value}
          {...inputProps}
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
        {actionButtonProps && (
          <Button
            className="mr-4 p-2!"
            variant="plain"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()

              actionButtonProps.onClick?.(e)
            }}
            {...actionButtonProps}
          />
        )}
      </div>
    </InputWrapper>
  )
}

export default memo(TextInput)
