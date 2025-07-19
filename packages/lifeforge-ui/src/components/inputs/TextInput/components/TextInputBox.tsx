/* eslint-disable react-compiler/react-compiler */
import clsx from 'clsx'
import { useCallback, useRef } from 'react'

function TextInputBox({
  value,
  setValue,
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
  setValue: (value: string) => void
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
  reference?: React.RefObject<HTMLInputElement | null>
  autoFocus?: boolean
  disabled?: boolean
  noAutoComplete?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  className?: string
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}) {
  const innerRef = useRef<HTMLInputElement | null>(null)

  const combinedRef = useCallback((node: HTMLInputElement | null) => {
    if (reference) reference.current = node
    if (inputRef) inputRef.current = node
    innerRef.current = node
  }, [])

  return (
    <>
      {isPassword && (
        <input hidden type="password" value="" onChange={() => {}} />
      )}
      <input
        ref={combinedRef}
        aria-label={placeholder}
        autoComplete={noAutoComplete ? 'off' : 'on'}
        className={clsx(
          'caret-custom-500 focus:placeholder:text-bg-500 mt-6 h-13 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wider placeholder:text-transparent focus:outline-hidden',
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
        onBlur={e => {
          onBlur(e)
          setValue(e.target.value.trim())
        }}
        onChange={e => {
          setValue(e.target.value)
        }}
        onKeyDown={onKeyDown}
      />
    </>
  )
}

export default TextInputBox
