import clsx from 'clsx'

import { autoFocusableRef } from '@components/inputs/shared/utils/autoFocusableRef'

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
} & Omit<React.HTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <>
      {isPassword && (
        <input hidden type="password" value="" onChange={() => {}} />
      )}
      <input
        ref={autoFocusableRef(autoFocus, inputRef)}
        aria-label={placeholder}
        autoComplete="off"
        className={clsx(
          'caret-custom-500 focus:placeholder:text-bg-500 w-full rounded-lg bg-transparent tracking-wider focus:outline-hidden',
          variant === 'classic'
            ? 'mt-6 h-13 p-6 pl-4 placeholder:text-transparent'
            : 'h-7 p-0',
          className
        )}
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
    </>
  )
}

export default TextInputBox
