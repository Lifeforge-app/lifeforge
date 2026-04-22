import { useEffect, useRef } from 'react'

import { Box, Flex, Text } from '@components/primitives'

import { vars } from '@/system'

import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import InputWrapper from '../shared/components/InputWrapper'
import Placeholder from '../shared/components/Placeholder'
import useInputLabel from '../shared/hooks/useInputLabel'
import type { InputVariants } from '../shared/types'
import { autoFocusableRef } from '../shared/utils/autoFocusableRef'

export type TextAreaInputProps = {
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
} & InputVariants

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
      <Flex align="center" gap="sm" position="relative" width="100%">
        {variant === 'classic' && label && (
          <InputLabel
            active={!!value && String(value).length > 0}
            hasError={!!errorMsg}
            label={inputLabel}
            required={required === true}
          />
        )}
        <Placeholder
          color={variant === 'classic' ? 'transparent' : 'default'}
          focusColor="default"
        >
          <Box
            asChild
            bg="transparent"
            maxHeight="32rem"
            minHeight="4rem"
            p={variant === 'classic' ? 'xl' : 'none'}
            pl={variant === 'classic' ? 'none' : undefined}
            rounded="lg"
            style={
              variant === 'classic'
                ? { paddingBottom: vars.radii.md }
                : undefined
            }
            width="100%"
          >
            <Text asChild tracking="wide">
              <textarea
                ref={autoFocusableRef(autoFocus, ref)}
                placeholder={placeholder}
                style={{
                  resize: 'none'
                }}
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
            </Text>
          </Box>
        </Placeholder>
      </Flex>
    </InputWrapper>
  )
}

export default TextAreaInput
