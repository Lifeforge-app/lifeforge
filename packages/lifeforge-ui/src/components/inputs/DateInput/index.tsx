import { Button } from '@components/buttons'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

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
  setValue: (date: Date | null) => void
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
  setValue,
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
          className="focus:placeholder:text-bg-500 h-13 outline-hidden focus:outline-hidden mt-6 w-full rounded-lg border-none bg-transparent px-4 tracking-wider placeholder:text-transparent"
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
          onChange={(value: Date | null) => setValue(value)}
        />
        {!!value && (
          <Button
            className="hover:bg-bg-300 dark:hover:bg-bg-700/30! p-2! mr-4"
            icon="tabler:x"
            variant="plain"
            onClick={() => {
              setValue(null)
            }}
          />
        )}
      </div>
    </InputWrapper>
  )
}

export default DateInput
