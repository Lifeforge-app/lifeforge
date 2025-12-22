import { memo, useRef, useState } from 'react'
import { usePromiseLoading } from 'shared'

import Button from '../Button'
import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import InputWrapper from '../shared/components/InputWrapper'
import useInputLabel from '../shared/hooks/useInputLabel'
import TextInputBox from './components/TextInputBox'

export type TextInputProps = {
  /** The style type of the input field. 'classic' shows label and icon with underline, 'plain' is a simple rounded box. */
  variant?: 'classic' | 'plain'
  /** The label text displayed above the input field. Required for 'classic' style. */
  label?: string
  /** The icon to display in the input field. Should be a valid icon name from Iconify. Required for 'classic' style. */
  icon?: string
  /** The placeholder text shown when the input is empty. */
  placeholder: string
  /** The current text value of the input field. */
  value: string
  /** Callback function called when the input value changes. */
  onChange: (value: string) => void
  /** Whether the input field is required for form validation. */
  required?: boolean
  /** Whether the input field is disabled and non-interactive. */
  disabled?: boolean
  /** Whether the input should automatically focus when rendered. */
  autoFocus?: boolean
  /** Whether the input should be masked as a password field. */
  isPassword?: boolean
  /** The input mode hint for virtual keyboards on mobile devices. */
  inputMode?:
    | 'text'
    | 'none'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search'
  /** Properties for constructing the action button component at the right hand side. */
  actionButtonProps?: React.ComponentProps<typeof Button>
  /** Additional CSS class names to apply to the input container. Use `!` suffix for Tailwind CSS class overrides. */
  className?: string
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
  /** Error message to display when the input is invalid. */
  errorMsg?: string
} & Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'>

function TextInput({
  variant = 'classic',
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
      variant={variant}
    >
      {variant === 'classic' && icon && (
        <InputIcon
          active={!!value && String(value).length > 0}
          hasError={!!errorMsg}
          icon={icon}
        />
      )}
      <div className="flex w-full items-center gap-2">
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
          value={value}
          variant={variant}
          onChange={onChange}
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
            {...actionButtonProps}
            className="hover:bg-bg-200! dark:hover:bg-bg-700/50! mr-4 p-2!"
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
