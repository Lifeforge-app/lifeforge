import dayjs from 'dayjs'
import { useCallback, useMemo, useRef } from 'react'

import { Box, Flex } from '@/components/primitives'
import { useModalStore } from '@/providers'

import { InputActionButton } from '../shared/components/InputActionButton'
import { InputIcon } from '../shared/components/InputIcon'
import { InputInnerWrapper } from '../shared/components/InputInnerWrapper'
import { InputLabel } from '../shared/components/InputLabel'
import { InputWrapper } from '../shared/components/InputWrapper'
import { Placeholder } from '../shared/components/Placeholder'
import { useInputLabel } from '../shared/hooks/useInputLabel'
import type { InputVariants } from '../shared/types'
import { autoFocusableRef } from '../shared/utils/autoFocusableRef'
import { DatePickerModal } from './DatePickerModal'

export * from './DatePickerModal'

/**
 * Props for the DateInput component.
 */
export interface DateInputProps {
  variant?: 'classic' | 'plain'
  /** The label text displayed above the date input field. Required for 'classic' style. */
  label?: string
  /** The icon to display in the date input field. Should be a valid icon name from Iconify. Required for 'classic' style. */
  icon?: string
  /** The current date value of the input. */
  value: Date | null
  /** Callback function called when the date value changes. */
  onChange: (date: Date | null) => void
  /** Whether the date field is required for form validation. */
  required?: boolean
  /** Whether the date input is disabled and non-interactive. */
  disabled?: boolean
  /** Whether the input should automatically focus when rendered. */
  autoFocus?: boolean
  /** Additional CSS class names to apply to the date input. */
  className?: string
  /** Whether the date input includes time selection. */
  hasTime?: boolean
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string | false
  /** Error message to display when the input is invalid. */
  errorMsg?: string
  /** The earliest selectable date. */
  startDate?: Date
  /** The latest selectable date. */
  endDate?: Date
  /** Callback function called when Enter is pressed. */
  onEnter?: () => void
}

/**
 * DateInput component for selecting dates and times via a modal dialog.
 */
export function DateInput({
  variant = 'classic',
  label,
  icon,
  value,
  onChange,
  required = false,
  disabled = false,
  autoFocus = false,
  className,
  hasTime = false,
  namespace,
  errorMsg,
  startDate,
  endDate,
  onEnter
}: DateInputProps & InputVariants) {
  const { open } = useModalStore()
  const inputLabel = useInputLabel({ namespace, label: label ?? '' })
  const ref = useRef<HTMLInputElement | null>(null)

  const handleOpen = useCallback(() => {
    if (disabled) {
      return
    }

    open(DatePickerModal, {
      value,
      onChange,
      label: inputLabel || label,
      icon: icon || (hasTime ? 'tabler:clock' : 'tabler:calendar'),
      hasTime,
      startDate,
      endDate,
      required,
      namespace
    })
  }, [
    disabled,
    open,
    value,
    onChange,
    inputLabel,
    label,
    icon,
    hasTime,
    startDate,
    endDate,
    required,
    namespace
  ])

  const formattedValue = useMemo(() => {
    if (!value) {
      return ''
    }

    return dayjs(value).format(hasTime ? 'MMMM D, YYYY h:mm A' : 'MMMM D, YYYY')
  }, [value, hasTime])

  const placeholderText = useMemo(() => {
    return `August 7, ${dayjs().year()}${hasTime ? ' 08:07 AM' : ''}`
  }, [hasTime])

  return (
    <InputWrapper
      className={className}
      disabled={disabled}
      errorMsg={errorMsg}
      inputRef={ref}
      style={{
        cursor: 'pointer'
      }}
      variant={variant}
      onClick={handleOpen}
    >
      {variant === 'classic' && (
        <InputIcon
          active={!!value}
          hasError={!!errorMsg}
          icon={icon || (hasTime ? 'tabler:clock' : 'tabler:calendar')}
        />
      )}
      <Flex align="center" gap="sm" position="relative" width="100%">
        {variant === 'classic' && label && (
          <Box asChild pr="3xl">
            <InputLabel
              active={!!value}
              hasError={!!errorMsg}
              label={inputLabel}
              required={required === true}
            />
          </Box>
        )}

        <InputInnerWrapper hasActionButton variant={variant}>
          <Placeholder
            color={variant === 'classic' ? 'transparent' : 'default'}
            focusColor="default"
          >
            <input
              ref={autoFocusableRef(autoFocus, ref)}
              readOnly
              disabled={disabled}
              placeholder={placeholderText}
              style={{
                cursor: disabled ? 'not-allowed' : 'pointer',
                caretColor: 'transparent',
                userSelect: 'none'
              }}
              tabIndex={disabled ? -1 : 0}
              value={formattedValue}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (onEnter) {
                    onEnter()
                  } else {
                    handleOpen()
                  }
                } else if (e.key === ' ' || e.key === 'ArrowDown') {
                  e.preventDefault()
                  handleOpen()
                }
              }}
            />
          </Placeholder>
        </InputInnerWrapper>
      </Flex>
      {!!value && !disabled ? (
        <InputActionButton
          hasError={!!errorMsg}
          icon="tabler:x"
          variant={variant}
          onClick={e => {
            e.stopPropagation()
            onChange(null)
          }}
        />
      ) : (
        <InputActionButton
          hasError={!!errorMsg}
          icon={icon || (hasTime ? 'tabler:clock' : 'tabler:calendar')}
          variant={variant}
          onClick={handleOpen}
        />
      )}
    </InputWrapper>
  )
}
