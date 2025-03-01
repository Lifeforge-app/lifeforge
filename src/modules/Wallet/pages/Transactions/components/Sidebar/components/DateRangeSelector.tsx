import clsx from 'clsx'
import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { DateInput } from '@components/inputs'
import { SidebarTitle } from '@components/layouts/sidebar'

function DateRangeSelector(): React.ReactElement {
  const { t } = useTranslation('modules.wallet')
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
      <SidebarTitle name={t('sidebar.dateRange')} />
      <div className="px-4">
        {dateInputsConfig.map(({ type, icon, name }, idx) => (
          <DateInput
            key={type}
            darker
            className={clsx('w-full', idx === 1 && 'mt-4')}
            date={
              searchParams.get(type) !== null &&
              moment(searchParams.get(type)).isValid()
                ? moment(searchParams.get(type)).format('YYYY-MM-DD')
                : ''
            }
            hasMargin={false}
            icon={icon}
            index={idx}
            name={name}
            namespace="modules.wallet"
            setDate={date => {
              handleDateChange(date, type)
            }}
          />
        ))}
      </div>
    </>
  )
}

export default DateRangeSelector
