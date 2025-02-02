import React, { useRef } from 'react'

function InputBox({
  value,
  updateValue,
  isPassword = false,
  inputMode,
  showPassword,
  placeholder,
  inputRef,
  reference,
  disabled = false,
  noAutoComplete = false,
  onKeyDown = () => {},
  className = '',
  onBlur = () => {}
}: {
  value: string
  updateValue: (value: string) => void
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
  showPassword?: boolean
  placeholder: string
  inputRef?: React.RefObject<HTMLInputElement | null>
  reference?: React.RefObject<HTMLInputElement | null>
  autoFocus?: boolean
  disabled?: boolean
  noAutoComplete?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  className?: string
  onBlur?: () => void
}): React.ReactElement {
  const innerRef = useRef<HTMLInputElement | null>(null)

  return (
    <>
      {isPassword && (
        <input hidden type="password" value="" onChange={() => {}} />
      )}
      <input
        ref={ref => {
          if (reference !== undefined) {
            reference.current = ref
          }
          if (inputRef !== undefined) {
            inputRef.current = ref
          }
          innerRef.current = ref
        }}
        autoComplete={noAutoComplete ? 'false' : 'true'}
        className={`mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wider caret-custom-500 placeholder:text-transparent focus:outline-hidden focus:placeholder:text-bg-500 ${className}`}
        disabled={disabled}
        inputMode={inputMode}
        placeholder={placeholder}
        style={
          isPassword && showPassword !== true ? { fontFamily: 'Arial' } : {}
        }
        type={isPassword && showPassword !== true ? 'password' : 'text'}
        value={value}
        onBlur={onBlur}
        onChange={e => {
          updateValue(e.target.value)
        }}
        onKeyDown={onKeyDown}
      />
    </>
  )
}

export default InputBox
