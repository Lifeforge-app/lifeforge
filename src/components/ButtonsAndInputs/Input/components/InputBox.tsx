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
  autoFocus = false,
  disabled = false,
  noAutoComplete = false,
  onKeyDown = () => {}
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
  showPassword: boolean
  placeholder: string
  inputRef: React.RefObject<HTMLInputElement | null>
  reference?: React.RefObject<HTMLInputElement | null>
  autoFocus?: boolean
  disabled?: boolean
  noAutoComplete?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}): React.ReactElement {
  const innerRef = useRef<HTMLInputElement | null>(null)

  return (
    <>
      {isPassword && (
        <input type="password" hidden value="" onChange={() => {}} />
      )}
      <input
        ref={ref => {
          if (reference !== undefined) {
            reference.current = ref
          }
          inputRef.current = ref
          innerRef.current = ref
        }}
        disabled={disabled}
        value={value}
        onChange={e => {
          updateValue(e.target.value)
        }}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        type={isPassword && !showPassword ? 'password' : 'text'}
        autoComplete={noAutoComplete ? 'false' : 'true'}
        style={isPassword && !showPassword ? { fontFamily: 'Arial' } : {}}
        className="mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wider caret-custom-500 placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500"
        autoFocus={autoFocus}
        inputMode={inputMode}
      />
    </>
  )
}

export default InputBox
