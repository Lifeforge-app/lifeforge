import moment from 'moment'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import DateInput from '@components/ButtonsAndInputs/DateInput'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'

function DateRangeSelector(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      <SidebarTitle name="Date Range" />
      <div className="relative px-4">
        <DateInput
          darker
          icon="tabler:calendar-up"
          date={
            searchParams.get('start_date') !== null &&
            moment(searchParams.get('start_date')).isValid()
              ? moment(searchParams.get('start_date')).format('YYYY-MM-DD')
              : ''
          }
          setDate={date => {
            setSearchParams(searchParams => {
              if (date === '') {
                searchParams.delete('start_date')
                return searchParams
              }

              const endDate =
                searchParams.get('end_date') !== null &&
                moment(searchParams.get('end_date')).isValid()
                  ? moment(searchParams.get('end_date'))
                  : moment()

              if (moment(date).isAfter(endDate)) {
                searchParams.set('end_date', moment(date).format('YYYY-MM-DD'))
              }

              searchParams.set('start_date', moment(date).format('YYYY-MM-DD'))
              return searchParams
            })
          }}
          name="Start Date"
          className="w-full"
          hasMargin={false}
        />
        <DateInput
          darker
          icon="tabler:calendar-down"
          date={
            searchParams.get('end_date') !== null &&
            moment(searchParams.get('end_date')).isValid()
              ? moment(searchParams.get('end_date')).format('YYYY-MM-DD')
              : ''
          }
          setDate={date => {
            setSearchParams(searchParams => {
              if (date === '') {
                searchParams.delete('end_date')
                return searchParams
              }

              const startDate =
                searchParams.get('start_date') !== null &&
                moment(searchParams.get('start_date')).isValid()
                  ? moment(searchParams.get('start_date'))
                  : moment()

              if (moment(date).isBefore(startDate)) {
                searchParams.set(
                  'start_date',
                  moment(date).format('YYYY-MM-DD')
                )
              }

              searchParams.set('end_date', moment(date).format('YYYY-MM-DD'))
              return searchParams
            })
          }}
          name="End Date"
          className="w-full"
        />
      </div>
    </>
  )
}

export default DateRangeSelector
