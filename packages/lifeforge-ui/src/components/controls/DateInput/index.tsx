import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import { Button } from '@components/controls'

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
  /** The label text displayed above the date input field. */
  label: string
  /** The icon to display in the date input field. Should be a valid icon name from Iconify. */
  icon: string
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
  const inputLabel = useInputLabel({ namespace, label })

  const { derivedThemeColor } = usePersonalization()

  const ref = useRef<DatePicker | null>(null)

  const [isCalendarOpen, setCalendarOpen] = useState(false)

  return (
    <InputWrapper
      className={className}
      disabled={disabled}
      errorMsg={errorMsg}
      onFocus={() => ref.current?.input?.focus()}
    >
      <InputIcon
        active={!!value}
        hasError={!!errorMsg}
        icon={icon}
        isFocused={isCalendarOpen}
      />
      <div className="flex w-full items-center gap-2">
        <InputLabel
          active={!!value}
          focused={isCalendarOpen}
          hasError={!!errorMsg}
          label={inputLabel}
          required={required === true}
        />
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
          className="focus:placeholder:text-bg-500 mt-6 h-13 w-full rounded-lg border-none bg-transparent px-4 tracking-wider outline-hidden placeholder:text-transparent focus:outline-hidden"
          dateFormat={hasTime ? 'MMMM d, yyyy h:mm aa' : 'MMMM d, yyyy'}
          formatWeekDay={(date: string) => {
            return date.slice(0, 3)
          }}
          placeholderText={`August 7, ${dayjs().year()}${
            hasTime ? ' 08:07 AM' : ''
          }`}
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
            className="hover:bg-bg-300 dark:hover:bg-bg-700/30! mr-4 p-2!"
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
