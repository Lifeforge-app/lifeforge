import moment from 'moment'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { DateInput } from '@components/inputs'
import { SidebarTitle } from '@components/layouts/sidebar'

function DateRangeSelector(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()

  const handleDateChange = (
    date: string,
    type: 'start_date' | 'end_date'
  ): void => {
    if (date === '') {
      searchParams.delete(type)
      setSearchParams(searchParams)
      return
    }

    const otherType = type === 'start_date' ? 'end_date' : 'start_date'
    const otherDate =
      searchParams.get(otherType) !== null &&
      moment(searchParams.get(otherType)).isValid()
        ? moment(searchParams.get(otherType))
        : moment()

    if (
      (type === 'start_date' && moment(date).isAfter(otherDate)) ||
      (type === 'end_date' && moment(date).isBefore(otherDate))
    ) {
      searchParams.set(otherType, moment(date).format('YYYY-MM-DD'))
    }

    searchParams.set(type, moment(date).format('YYYY-MM-DD'))

    setSearchParams(searchParams)
  }

  const dateInputsConfig = [
    { type: 'start_date', icon: 'tabler:calendar-up', name: 'Start Date' },
    { type: 'end_date', icon: 'tabler:calendar-down', name: 'End Date' }
  ] as const

  return (
    <>
      <SidebarTitle name="Date Range" />
      <div className="px-4">
        {dateInputsConfig.map(({ type, icon, name }, idx) => (
          <DateInput
            index={idx}
            key={type}
            darker
            icon={icon}
            date={
              searchParams.get(type) !== null &&
              moment(searchParams.get(type)).isValid()
                ? moment(searchParams.get(type)).format('YYYY-MM-DD')
                : ''
            }
            setDate={date => {
              handleDateChange(date, type)
            }}
            name={name}
            className={`w-full ${idx === 1 && 'mt-4'}`}
            hasMargin={false}
          />
        ))}
      </div>
    </>
  )
}

export default DateRangeSelector
