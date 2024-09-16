import React from 'react'

function InputWrapper({
  darker = false,
  additionalClassName = '',
  disabled = false,
  children
}: {
  darker?: boolean
  additionalClassName?: string
  disabled?: boolean
  children: React.ReactNode
}): React.ReactElement {
  return (
    <div
      className={`group relative flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom transition-all focus-within:!border-custom-500 hover:bg-bg-200 ${
        darker
          ? 'dark:bg-bg-800/50 dark:hover:bg-bg-800'
          : 'dark:bg-bg-800 dark:hover:bg-bg-700'
      } ${additionalClassName} ${
        disabled ? '!pointer-events-none opacity-50' : 'cursor-text'
      }`}
      onClick={e => {
        e.currentTarget.querySelector('input')?.focus()
      }}
    >
      {children}
    </div>
  )
}

export default InputWrapper
