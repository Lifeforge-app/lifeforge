import clsx from 'clsx'

import Placeholder from '@components/inputs/shared/components/Placeholder'
import { autoFocusableRef } from '@components/inputs/shared/utils/autoFocusableRef'

import { textInputBoxRecipe } from './TextInputBox.css'

function TextInputBox({
  value,
  onChange,
  isPassword = false,
  inputMode,
  showPassword,
  placeholder,
  inputRef,
  disabled = false,
  className = '',
  autoFocus = false,
  variant = 'classic',
  size = 'default',
  ...inputProps
}: {
  value: string
  onChange: (value: string) => void
  isPassword?: boolean
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search'
    | undefined
  showPassword?: boolean
  placeholder: string
  inputRef?: React.RefObject<HTMLInputElement | null>
  autoFocus?: boolean
  disabled?: boolean
  className?: string
  variant?: 'classic' | 'plain'
  size?: 'small' | 'default'
} & Omit<React.HTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  const inputClassName = textInputBoxRecipe({
    variant,
    size: variant === 'plain' ? size : undefined
  })

  return (
    <>
      {isPassword && (
        <input hidden type="password" value="" onChange={() => {}} />
      )}
      <Placeholder
        color={variant === 'classic' ? 'transparent' : 'default'}
        focusColor="default"
      >
        <input
          ref={autoFocusableRef(autoFocus, inputRef)}
          aria-label={placeholder}
          autoComplete="off"
          className={clsx(inputClassName, className)}
          disabled={disabled}
          inputMode={inputMode}
          placeholder={placeholder}
          style={
            isPassword && showPassword !== true ? { fontFamily: 'Arial' } : {}
          }
          type={isPassword && showPassword !== true ? 'password' : 'text'}
          value={value}
          onChange={e => {
            onChange(e.target.value)
          }}
          {...inputProps}
        />
      </Placeholder>
    </>
  )
}

export default TextInputBox
