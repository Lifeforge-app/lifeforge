import clsx from 'clsx'

function TextInputBox({
  value,
  setValue,
  isPassword = false,
  inputMode,
  showPassword,
  placeholder,
  inputRef,
  disabled = false,
  className = '',
  ...inputProps
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
  autoFocus?: boolean
  disabled?: boolean
  className?: string
} & React.HTMLAttributes<HTMLInputElement>) {
  return (
    <>
      {isPassword && (
        <input hidden type="password" value="" onChange={() => {}} />
      )}
      <input
        ref={inputRef}
        aria-label={placeholder}
        autoComplete="off"
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
        onChange={e => {
          setValue(e.target.value)
        }}
        {...inputProps}
      />
    </>
  )
}

export default TextInputBox
