import { Icon } from '@iconify/react'
import React from 'react'
import DatePicker from 'react-date-picker'
import { useTranslation } from 'react-i18next'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import { toCamelCase } from '@utils/strings'

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

interface DateInputProps {
  date: string
  setDate: (date: string) => void
  name: string
  icon: string
  hasMargin?: boolean
  className?: string
}

const DateInput: React.FC<DateInputProps> = ({
  date,
  setDate,
  name,
  icon,
  hasMargin = true,
  className = ''
}) => {
  const { t } = useTranslation()
  const { language } = usePersonalizationContext()

  return (
    <div
      className={`group relative ${
        hasMargin && 'mt-4'
      } flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50 ${className}`}
    >
      <Icon
        icon={icon}
        className={`ml-6 size-6 shrink-0 ${
          date !== '' ? 'text-bg-100' : 'text-bg-500'
        }`}
      />
      <div className="flex w-full items-center gap-2">
        <span
          className={
            'pointer-events-none absolute left-[4.2rem] top-6 -translate-y-1/2 text-[14px] font-medium tracking-wide text-bg-500 transition-all group-focus-within:!text-custom-500'
          }
        >
          {t(`input.${toCamelCase(name)}`)}
        </span>
        <DatePicker
          value={date}
          onChange={(newDate: Value) => {
            setDate(newDate?.toString() ?? '')
          }}
          format="dd-MM-y"
          clearIcon={null}
          calendarIcon={null}
          calendarProps={{
            className:
              'bg-bg-200 dark:bg-bg-800 outline-none border-none rounded-lg p-4',
            tileClassName:
              'hover:bg-bg-300 dark:hover:bg-bg-700/50 rounded-md disabled:text-bg-500 disabled:bg-transparent disabled:cursor-not-allowed disabled:hover:!bg-transparent disabled:dark:hover:!bg-transparent',
            locale: language,
            prevLabel: <Icon icon="tabler:chevron-left" />,
            nextLabel: <Icon icon="tabler:chevron-right" />,
            prev2Label: <Icon icon="tabler:chevrons-left" />,
            next2Label: <Icon icon="tabler:chevrons-right" />
          }}
          className="mt-8 h-10 w-full rounded-lg border-none bg-transparent px-4 tracking-wider outline-none placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500"
        />
        {date !== '' && (
          <button
            onClick={() => {
              setDate('')
            }}
            className="mr-4 shrink-0 rounded-lg p-2 text-bg-500 hover:bg-bg-500/30 hover:text-bg-200 focus:outline-none"
            aria-label="Clear date"
          >
            <Icon icon="tabler:x" className="size-6" />
          </button>
        )}
      </div>
    </div>
  )
}

export default DateInput
