import { DatePickerModalContent } from './components/DatePickerModalContent'
import { DatePickerProvider } from './contexts/DatePickerContext'

export interface DatePickerModalData {
  value: Date | null
  onChange: (date: Date | null) => void
  label?: string
  icon?: string
  hasTime?: boolean
  startDate?: Date
  endDate?: Date
  required?: boolean
  namespace?: string | false
}

export function DatePickerModal({
  data: {
    value,
    onChange,
    icon,
    hasTime = false,
    startDate,
    endDate,
    namespace
  },
  onClose
}: {
  data: DatePickerModalData
  onClose: () => void
}) {
  return (
    <DatePickerProvider
      endDate={endDate}
      hasTime={hasTime}
      startDate={startDate}
      value={value}
      onChange={onChange}
      onClose={onClose}
    >
      <DatePickerModalContent
        icon={icon}
        namespace={namespace}
        onClose={onClose}
      />
    </DatePickerProvider>
  )
}
