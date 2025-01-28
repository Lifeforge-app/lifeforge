import { Icon } from '@iconify/react'
import React, { useRef } from 'react'
import DatePicker from 'react-date-picker'
import { useTranslation } from 'react-i18next'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import { toCamelCase } from '@utils/strings'
import InputIcon from './shared/InputIcon'
import InputLabel from './shared/InputLabel'
import InputWrapper from './shared/InputWrapper'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

interface DateInputProps {
  date: string
  setDate: (date: string) => void
  name: string
  icon: string
  hasMargin?: boolean
  className?: string
  darker?: boolean
  modalRef?: React.RefObject<HTMLElement | null>
  index?: number
  required?: boolean
}

const DateInput: React.FC<DateInputProps> = ({
  date,
  setDate,
  name,
  icon,
  hasMargin = true,
  className = '',
  darker = false,
  modalRef,
  index = 0,
  required
}) => {
  const { t } = useTranslation()
  const { language } = usePersonalizationContext()
  const ref = useRef<HTMLInputElement | null>(null)

  function updateCalendarLocation(): void {
    setTimeout(() => {
      if (modalRef?.current === null || ref.current === null) {
        return
      }

      const reactCalendar = document.querySelectorAll('.react-calendar')[
        index
      ] as HTMLElement

      const calendarInput = ref.current.querySelector('.react-date-picker')

      if (reactCalendar === null || calendarInput === null) {
        return
      }

      const inputRect = calendarInput.getBoundingClientRect()

      reactCalendar.style.top = `${
        inputRect.top + inputRect.height + window.scrollY
      }px`

      reactCalendar.style.left = `${inputRect.left + window.scrollX}px`
    }, 10)
  }

  return (
    <InputWrapper
      className={`${className} ${hasMargin ? 'mt-4' : ''}`}
      darker={darker}
    >
      <InputIcon icon={icon} active={date !== ''} />
      <div ref={ref} className="flex w-full items-center gap-2">
        <InputLabel
          required={required === true}
          label={t(`input.${toCamelCase(name)}`)}
          active
        />
        <DatePicker
          onCalendarOpen={updateCalendarLocation}
          portalContainer={
            modalRef?.current ?? (document.querySelector('#app') as HTMLElement)
          }
          value={date}
          onChange={(newDate: Value) => {
            setDate(newDate?.toString() ?? '')
          }}
          format="dd-MM-y"
          clearIcon={null}
          calendarIcon={null}
          calendarProps={{
            className:
              'bg-bg-200 dark:bg-bg-800 absolute z-9999 outline-hidden border-none rounded-lg p-4',
            tileClassName:
              'hover:bg-bg-300 dark:hover:bg-bg-700/50 rounded-md disabled:text-bg-500 disabled:bg-transparent disabled:cursor-not-allowed disabled:hover:bg-transparent! dark:disabled:hover:bg-transparent!',
            locale: language,
            prevLabel: <Icon icon="tabler:chevron-left" />,
            nextLabel: <Icon icon="tabler:chevron-right" />,
            prev2Label: <Icon icon="tabler:chevrons-left" />,
            next2Label: <Icon icon="tabler:chevrons-right" />
          }}
          className="mt-6 h-10 w-full rounded-lg border-none bg-transparent px-4 tracking-wider outline-hidden placeholder:text-transparent focus:outline-hidden focus:placeholder:text-bg-500"
        />
        {date !== '' && (
          <button
            onClick={() => {
              setDate('')
            }}
            className="mr-4 shrink-0 rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-300 hover:text-bg-800 focus:outline-hidden dark:hover:bg-bg-700/70 dark:hover:text-bg-200"
            aria-label="Clear date"
          >
            <Icon icon="tabler:x" className="size-6" />
          </button>
        )}
      </div>
    </InputWrapper>
  )
}

export default DateInput
