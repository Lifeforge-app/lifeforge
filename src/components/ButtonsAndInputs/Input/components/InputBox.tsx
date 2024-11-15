import React from 'react'

function InputBox({
  value,
  updateValue,
  isPassword = false,
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
  placeholder: string
  inputRef: React.RefObject<HTMLInputElement | null>
  reference?: React.RefObject<HTMLInputElement | null>
  autoFocus?: boolean
  disabled?: boolean
  noAutoComplete?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}): React.ReactElement {
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
        }}
        disabled={disabled}
        value={value}
        onChange={e => {
          updateValue(e.target.value)
        }}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        type={isPassword ? 'password' : 'text'}
        autoComplete={noAutoComplete ? 'false' : 'true'}
        style={isPassword ? { fontFamily: 'Arial' } : {}}
        className={`mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wider caret-custom-500 placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500 ${
          isPassword && Boolean(value) ? 'text-2xl focus:text-base' : ''
        }`}
        autoFocus={autoFocus}
        onFocus={e => {
          if (isPassword) {
            e.target.type = 'text'
          }
        }}
        onBlur={e => {
          if (isPassword) {
            e.target.type = 'password'
          }
        }}
      />
    </>
  )
}

export default InputBox
