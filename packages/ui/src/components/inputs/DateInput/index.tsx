import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import tinycolor from 'tinycolor2'

import { usePersonalization } from '@lifeforge/shared'

import { Flex } from '@/components/primitives'

import { InputActionButton } from '../shared/components/InputActionButton'
import { InputIcon } from '../shared/components/InputIcon'
import { InputInnerWrapper } from '../shared/components/InputInnerWrapper'
import { InputLabel } from '../shared/components/InputLabel'
import { InputWrapper } from '../shared/components/InputWrapper'
import { Placeholder } from '../shared/components/Placeholder'
import { useInputLabel } from '../shared/hooks/useInputLabel'
import type { InputVariants } from '../shared/types'
import { autoFocusableRef } from '../shared/utils/autoFocusableRef'
import * as styles from './DateInput.css'
import { CalendarHeader } from './components/CalendarHeader'

/**
 * Props for the DateInput component.
 */
interface DateInputProps {
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
  /** Additional CSS class names to apply to the date input. Use `!` suffix for Tailwind CSS class overrides. */
  className?: string
  /** Whether the date input includes time selection. */
  hasTime?: boolean
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
  /** Error message to display when the input is invalid. */
  errorMsg?: string
}

/**
 * DateInput component for selecting dates and times.
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
  errorMsg
}: DateInputProps & InputVariants) {
  const inputLabel = useInputLabel({ namespace, label: label ?? '' })

  const { derivedThemeColor } = usePersonalization()

  const ref = useRef<DatePicker | null>(null)

  const [isCalendarOpen, setCalendarOpen] = useState(false)

  return (
    <InputWrapper
      className={className}
      disabled={disabled}
      errorMsg={errorMsg}
      variant={variant}
      onFocus={() => ref.current?.input?.focus()}
    >
      {variant === 'classic' && icon && (
        <InputIcon active={!!value} hasError={!!errorMsg} icon={icon} />
      )}
      <Flex align="center" gap="sm" position="relative" width="100%">
        {variant === 'classic' && label && (
          <InputLabel
            active={!!value}
            hasError={!!errorMsg}
            label={inputLabel}
            required={required === true}
          />
        )}

        <InputInnerWrapper hasActionButton={!!value} variant={variant}>
          <Placeholder
            color={variant === 'classic' ? 'transparent' : 'default'}
            focusColor="default"
          >
            <DatePicker
              ref={autoFocusableRef(autoFocus, ref, e => {
                e.input?.focus()
              })}
              shouldCloseOnSelect
              calendarClassName={
                tinycolor(derivedThemeColor).isLight()
                  ? 'theme-light'
                  : 'theme-dark'
              }
              dateFormat={hasTime ? 'MMMM d, yyyy h:mm aa' : 'MMMM d, yyyy'}
              formatWeekDay={(date: string) => {
                return date.slice(0, 3)
              }}
              placeholderText={`August 7, ${dayjs().year()}${
                hasTime ? ' 08:07 AM' : ''
              }`}
              popperClassName="-mx-13"
              popperPlacement="bottom-start"
              portalId="app"
              renderCustomHeader={CalendarHeader}
              selected={value || null}
              showPopperArrow={false}
              showTimeSelect={hasTime}
              weekDayClassName={(date: Date) => {
                const isWeekend = date.getDay() === 0

                return isWeekend ? styles.weekDayRed : styles.weekDayMuted
              }}
              onCalendarClose={() => {
                setCalendarOpen(false)
              }}
              onCalendarOpen={() => {
                setCalendarOpen(true)
              }}
              onChange={(value: Date | null) => onChange(value)}
            />
          </Placeholder>
        </InputInnerWrapper>
      </Flex>
      {!!value && (
        <InputActionButton
          hasError={!!errorMsg}
          icon="tabler:x"
          variant={variant}
          onClick={() => {
            onChange(null)
          }}
        />
      )}
    </InputWrapper>
  )
}
