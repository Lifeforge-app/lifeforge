import React, { useEffect, useRef } from 'react'

import InputIcon from './shared/components/InputIcon'
import InputLabel from './shared/components/InputLabel'
import InputWrapper from './shared/components/InputWrapper'
import useInputLabel from './shared/hooks/useInputLabel'

export interface TextAreaInputProps {
  /** The label text displayed above the textarea field. */
  label: string
  /** The icon to display next to the label. Should be a valid icon name from Iconify. */
  icon: string
  /** The placeholder text displayed when the textarea is empty. */
  placeholder: string
  /** The current text value of the textarea. */
  value: string
  /** Callback function called when the textarea value changes. */
  setValue: (value: string) => void
  /** Whether the textarea field is required for form validation. */
  required?: boolean
  /** Whether the textarea is disabled and non-interactive. */
  disabled?: boolean
  /** Additional CSS class names to apply to the textarea element. Use `!` suffix for Tailwind CSS class overrides. */
  className?: string
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
  errorMsg?: string
}

function TextAreaInput({
  label,
  icon,
  placeholder,
  value,
  setValue,
  required,
  disabled,
  className,
  namespace,
  errorMsg
}: TextAreaInputProps) {
  const inputLabel = useInputLabel({ namespace, label })

  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!ref.current) return

    ref.current.style.height = 'auto'
    ref.current.style.height = ref.current.scrollHeight + 'px'
  }, [value])

  return (
    <InputWrapper
      className={className}
      disabled={disabled}
      errorMsg={errorMsg}
      inputRef={ref}
    >
      <InputIcon
        active={!!value && String(value).length > 0}
        hasError={!!errorMsg}
        icon={icon}
      />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          active={!!value && String(value).length > 0}
          hasError={!!errorMsg}
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
