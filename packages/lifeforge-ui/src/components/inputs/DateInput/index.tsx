import clsx from 'clsx'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import { Button } from '@components/inputs'

import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import InputWrapper from '../shared/components/InputWrapper'
import useInputLabel from '../shared/hooks/useInputLabel'
import { autoFocusableRef } from '../shared/utils/autoFocusableRef'
import CalendarHeader from './components/CalendarHeader'

/**
 * Props for the DateInput component.
 */
interface DateInputProps {
  /** The style type of the input field. 'classic' shows label and icon with underline, 'plain' is a simple rounded box. */
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
function DateInput({
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
}: DateInputProps) {
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
        <InputIcon
          active={!!value}
          hasError={!!errorMsg}
          icon={icon}
          isFocused={isCalendarOpen}
        />
      )}
      <div className="flex w-full items-center gap-2">
        {variant === 'classic' && label && (
          <InputLabel
            active={!!value}
            focused={isCalendarOpen}
            hasError={!!errorMsg}
            label={inputLabel}
            required={required === true}
          />
        )}
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
          className={clsx(
            'focus:placeholder:text-bg-500 w-full rounded-lg border-none bg-transparent tracking-wider outline-hidden focus:outline-hidden',
            variant === 'classic'
              ? 'mt-6 h-13 px-4 placeholder:text-transparent'
              : 'h-7 p-0'
          )}
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

            return isWeekend ? 'text-red-500!' : 'text-bg-500!'
          }}
          onCalendarClose={() => {
            setCalendarOpen(false)
          }}
          onCalendarOpen={() => {
            setCalendarOpen(true)
          }}
          onChange={(value: Date | null) => onChange(value)}
        />
        {!!value && (
          <Button
            className={clsx(
              'hover:bg-bg-300 dark:hover:bg-bg-700/30! p-2!',
              variant === 'classic' && 'mr-4'
            )}
            icon="tabler:x"
            variant="plain"
            onClick={() => {
              onChange(null)
            }}
          />
        )}
      </div>
    </InputWrapper>
  )
}

export default DateInput
