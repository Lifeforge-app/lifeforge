import React, { useEffect, useRef } from 'react'

import InputIcon from './shared/components/InputIcon'
import InputLabel from './shared/components/InputLabel'
import InputWrapper from './shared/components/InputWrapper'
import useInputLabel from './shared/hooks/useInputLabel'

export interface ITextAreaInputProps {
  icon: string
  name: string
  placeholder: string
  value: string
  setValue: (value: string) => void

  className?: string
  darker?: boolean
  disabled?: boolean
  onActionButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  required?: boolean
  namespace: string | false
  tKey?: string
}

function TextAreaInput({
  className = '',
  darker = false,
  disabled = false,
  icon,
  name,
  placeholder,
  required,
  setValue,
  value,
  namespace,
  tKey
}: ITextAreaInputProps) {
  const inputLabel = useInputLabel(namespace, name, tKey)

  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!ref.current) return

    ref.current.style.height = 'auto'
    ref.current.style.height = ref.current.scrollHeight + 'px'
  }, [value])

  return (
    <InputWrapper
      className={className}
      darker={darker}
      disabled={disabled}
      inputRef={ref}
    >
      <InputIcon active={!!value && String(value).length > 0} icon={icon} />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          active={!!value && String(value).length > 0}
          label={inputLabel}
          required={required === true}
        />
        <textarea
          ref={ref}
          className="focus:placeholder:text-bg-400 dark:focus:placeholder:text-bg-600 mt-3 -mb-3 min-h-8 w-full resize-none rounded-lg bg-transparent p-6 pl-4 tracking-wide outline-hidden placeholder:text-transparent focus:outline-hidden"
          placeholder={placeholder}
          value={value}
          onInput={e => {
            setValue(e.currentTarget.value)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const cursorPosition = e.currentTarget.selectionStart

              const text = e.currentTarget.value

              const newText =
                text.slice(0, cursorPosition) +
                '\n' +
                text.slice(cursorPosition)

              setValue(newText)
              e.currentTarget.value = newText
              e.currentTarget.setSelectionRange(
                cursorPosition + 1,
                cursorPosition + 1
              )
              e.preventDefault()
            }
          }}
        />
      </div>
    </InputWrapper>
  )
}

export default TextAreaInput
