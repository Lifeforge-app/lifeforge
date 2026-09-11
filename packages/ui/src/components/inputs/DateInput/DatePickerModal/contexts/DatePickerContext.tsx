import dayjs from 'dayjs'
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'

export interface DatePickerContextValue {
  selectedDate: dayjs.Dayjs | null
  setSelectedDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>
  currentYearMonth: dayjs.Dayjs
  setCurrentMonth: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>
  hasTime: boolean
  startDate?: Date
  endDate?: Date
  prevDisabled: boolean
  nextDisabled: boolean
  onSelectDate: (day: dayjs.Dayjs) => void
  onConfirm: () => void
}

export interface DatePickerProviderProps {
  children: ReactNode
  value: Date | null
  onChange: (date: Date | null) => void
  onClose: () => void
  hasTime?: boolean
  startDate?: Date
  endDate?: Date
}

const DatePickerContext = createContext<DatePickerContextValue | undefined>(
  undefined
)

export function DatePickerProvider({
  children,
  value,
  onChange,
  onClose,
  hasTime = false,
  startDate,
  endDate
}: DatePickerProviderProps) {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(() => {
    return value ? dayjs(value) : null
  })

  const [currentYearMonth, setCurrentMonth] = useState<dayjs.Dayjs>(() => {
    return value ? dayjs(value).startOf('month') : dayjs().startOf('month')
  })

  function onSelectDate(day: dayjs.Dayjs) {
    if (hasTime && selectedDate) {
      setSelectedDate(
        day
          .set('hour', selectedDate.hour())
          .set('minute', selectedDate.minute())
          .set('second', 0)
          .set('millisecond', 0)
      )
    } else {
      setSelectedDate(day)
    }

    if (!day.isSame(currentYearMonth, 'month')) {
      setCurrentMonth(day.startOf('month'))
    }
  }

  const prevDisabled =
    startDate !== undefined &&
    currentYearMonth
      .subtract(1, 'month')
      .endOf('month')
      .isBefore(dayjs(startDate).startOf('day'))

  const nextDisabled =
    endDate !== undefined &&
    currentYearMonth
      .add(1, 'month')
      .startOf('month')
      .isAfter(dayjs(endDate).endOf('day'))

  const contextValue = useMemo<DatePickerContextValue>(
    () => ({
      selectedDate,
      setSelectedDate,
      currentYearMonth,
      setCurrentMonth,
      hasTime,
      startDate,
      endDate,
      prevDisabled,
      nextDisabled,
      onSelectDate,
      onConfirm: () => {
        onChange(selectedDate ? selectedDate.toDate() : null)
        onClose()
      }
    }),
    [
      selectedDate,
      currentYearMonth,
      hasTime,
      startDate,
      endDate,
      prevDisabled,
      nextDisabled,
      onChange,
      onClose
    ]
  )

  return <DatePickerContext value={contextValue}>{children}</DatePickerContext>
}

export function useDatePicker(): DatePickerContextValue {
  const context = useContext(DatePickerContext)

  if (!context) {
    throw new Error('useDatePicker must be used within a DatePickerProvider')
  }

  return context
}
