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
  inputRef?: React.RefObject<HTMLInputElement | null>
  children: React.ReactNode
}): React.ReactElement {
  const { componentBgWithHover, darkerComponentBgWithHover } = useThemeColors()

  return (
    <div
      className={`group relative flex shrink-0 items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 pl-6 shadow-custom transition-all focus-within:!border-custom-500 hover:bg-bg-200 ${
        darker ? darkerComponentBgWithHover : componentBgWithHover
      } ${className} ${
        disabled ? '!pointer-events-none opacity-50' : 'cursor-text'
      }`}
      onClick={() => {
        if (inputRef?.current !== undefined && inputRef.current !== null) {
          inputRef.current.focus()
        }
      }}
    >
      {children}
    </div>
  )
}

export default InputWrapper
