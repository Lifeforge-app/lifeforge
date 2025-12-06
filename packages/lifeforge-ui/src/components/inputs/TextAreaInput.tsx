import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'

import InputIcon from './shared/components/InputIcon'
import InputLabel from './shared/components/InputLabel'
import InputWrapper from './shared/components/InputWrapper'
import useInputLabel from './shared/hooks/useInputLabel'
import { autoFocusableRef } from './shared/utils/autoFocusableRef'

export interface TextAreaInputProps {
  /** The style type of the input field. 'classic' shows label and icon with underline, 'plain' is a simple rounded box. */
  variant?: 'classic' | 'plain'
  /** The label text displayed above the textarea field. Required for 'classic' style. */
  label?: string
  /** The icon to display next to the label. Should be a valid icon name from Iconify. Required for 'classic' style. */
  icon?: string
  /** The placeholder text displayed when the textarea is empty. */
  placeholder: string
  /** The current text value of the textarea. */
  value: string
  /** Callback function called when the textarea value changes. */
  onChange: (value: string) => void
  /** Whether the textarea field is required for form validation. */
  required?: boolean
  /** Whether the textarea is disabled and non-interactive. */
  disabled?: boolean
  /** Whether the textarea should automatically focus when rendered. */
  autoFocus?: boolean
  /** Additional CSS class names to apply to the textarea element. Use `!` suffix for Tailwind CSS class overrides. */
  className?: string
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
  /** Error message to display when the input is invalid. */
  errorMsg?: string
}

function TextAreaInput({
  variant = 'classic',
  label,
  icon,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  autoFocus = false,
  className,
  namespace,
  errorMsg
}: TextAreaInputProps) {
  const inputLabel = useInputLabel({ namespace, label: label ?? '' })

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
      variant={variant}
    >
      {variant === 'classic' && icon && (
        <InputIcon
          active={!!value && String(value).length > 0}
          hasError={!!errorMsg}
          icon={icon}
        />
      )}
      <div className="flex w-full items-center gap-2">
        {variant === 'classic' && label && (
          <InputLabel
            active={!!value && String(value).length > 0}
            hasError={!!errorMsg}
            label={inputLabel}
            required={required === true}
          />
        )}
        <textarea
          ref={autoFocusableRef(autoFocus, ref)}
          className={clsx(
            'focus:placeholder:text-bg-400 dark:focus:placeholder:text-bg-600 max-h-128 min-h-8 w-full resize-none rounded-lg bg-transparent tracking-wide outline-hidden focus:outline-hidden',
            variant === 'classic'
              ? 'mt-9 px-6 pb-3 pl-4 placeholder:text-transparent'
              : 'p-0'
          )}
          placeholder={placeholder}
          value={value}
          onInput={e => {
            onChange(e.currentTarget.value)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const cursorPosition = e.currentTarget.selectionStart

              const text = e.currentTarget.value

              const newText =
                text.slice(0, cursorPosition) +
                '\n' +
                text.slice(cursorPosition)

              onChange(newText)
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
