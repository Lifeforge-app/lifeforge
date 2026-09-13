import dayjs from 'dayjs'

import { DateInput, SidebarTitle, Stack } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'

function DateRangeSelector() {
  const { startDate, endDate, setFilters, updateFilter } = useFilter()

  const handleClear = () => {
    setFilters({
      startDate: '',
      endDate: ''
    })
  }

  const handleDateChange = (
    date: Date | null,
    type: 'start_date' | 'end_date'
  ) => {
    if (!date) {
      if (type === 'start_date') updateFilter('startDate', '')
      else updateFilter('endDate', '')

      return
    }

    const otherDate =
      type === 'start_date'
        ? endDate !== '' && dayjs(endDate).isValid()
          ? dayjs(endDate)
          : dayjs()
        : startDate !== '' && dayjs(startDate).isValid()
          ? dayjs(startDate)
          : dayjs()

    if (
      (type === 'start_date' && dayjs(date).isAfter(otherDate)) ||
      (type === 'end_date' && dayjs(date).isBefore(otherDate))
    ) {
      if (type === 'start_date') {
        setFilters({
          endDate: dayjs(date).format('YYYY-MM-DD'),
          startDate: dayjs(date).format('YYYY-MM-DD')
        })
      } else {
        setFilters({
          startDate: dayjs(date).format('YYYY-MM-DD'),
          endDate: dayjs(date).format('YYYY-MM-DD')
        })
      }

      return
    }

    if (type === 'start_date')
      updateFilter('startDate', dayjs(date).format('YYYY-MM-DD'))
    else updateFilter('endDate', dayjs(date).format('YYYY-MM-DD'))
  }

  return (
    <>
      <SidebarTitle
        actionButton={
          startDate !== '' || endDate !== ''
            ? {
                icon: 'tabler:trash',
                onClick: handleClear
              }
            : undefined
        }
        label="dateRange"
      />
      <Stack gap="md" px="md">
        <DateInput
          icon="tabler:calendar-up"
          label="Start Date"
          value={
            startDate !== '' && dayjs(startDate).isValid()
              ? dayjs(startDate).toDate()
              : null
          }
          onChange={date => handleDateChange(date, 'start_date')}
        />
        <DateInput
          icon="tabler:calendar-down"
          label="End Date"
          value={
            endDate !== '' && dayjs(endDate).isValid()
              ? dayjs(endDate).toDate()
              : null
          }
          onChange={date => handleDateChange(date, 'end_date')}
        />
      </Stack>
    </>
  )
}

export default DateRangeSelector
