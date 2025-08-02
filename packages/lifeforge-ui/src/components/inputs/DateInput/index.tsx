import { Button } from '@components/buttons'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import InputIcon from '../shared/components/InputIcon'
import InputLabel from '../shared/components/InputLabel'
import InputWrapper from '../shared/components/InputWrapper'
import useInputLabel from '../shared/hooks/useInputLabel'
import CalendarHeader from './components/CalendarHeader'

interface DateInputProps {
  label: string
  icon: string
  value: Date | null
  setValue: (date: Date | null) => void
  required?: boolean
  disabled?: boolean
  className?: string
  hasTime?: boolean
  namespace: string | false
  tKey?: string
}

function DateInput({
  label,
  icon,
  value,
  setValue,
  required,
  disabled,
  className,
  hasTime,
  namespace,
  tKey
}: DateInputProps) {
  const inputLabel = useInputLabel(namespace, label, tKey)

  const { derivedThemeColor } = usePersonalization()

  const ref = useRef<HTMLInputElement | null>(null)

  const [isCalendarOpen, setCalendarOpen] = useState(false)

  return (
    <InputWrapper className={className} disabled={disabled}>
      <InputIcon active={!!value} icon={icon} isFocused={isCalendarOpen} />
      <div ref={ref} className="flex w-full items-center gap-2">
        <InputLabel
          active={!!value}
          focused={isCalendarOpen}
          label={inputLabel}
          required={required === true}
        />
        <DatePicker
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
          onChange={(value: Date | null) => setValue(value)}
        />
        {!!value && (
          <Button
            className="hover:bg-bg-300 dark:hover:bg-bg-700/30! mr-4 p-2!"
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
