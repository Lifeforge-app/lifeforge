import React from 'react'
import useThemeColors from '@hooks/useThemeColor'

function InputWrapper({
  darker = false,
  className = '',
  disabled = false,
  inputRef,
  children
}: {
  darker?: boolean
  className?: string
  disabled?: boolean
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  children: React.ReactNode
}): React.ReactElement {
  const { componentBgWithHover, componentBgLighterWithHover } = useThemeColors()

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault()
          if (inputRef?.current !== undefined && inputRef.current !== null) {
            inputRef.current.focus()
          }
        }
      }}
      className={`group relative flex shrink-0 items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 pl-6 shadow-custom transition-all focus-within:!border-custom-500 hover:bg-bg-200 ${
        darker ? componentBgLighterWithHover : componentBgWithHover
      } ${className} ${
        disabled ? '!pointer-events-none opacity-50' : 'cursor-text'
      }`}
      onClick={e => {
        if (inputRef?.current !== undefined && inputRef.current !== null) {
          inputRef.current.focus()
          if ((e.target as HTMLElement).tagName !== 'INPUT') {
            inputRef.current.setSelectionRange(
              inputRef.current.value.length,
              inputRef.current.value.length
            )
          }
        }
      }}
    >
      {children}
    </div>
  )
}

export default InputWrapper
