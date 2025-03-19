import clsx from 'clsx'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { DateInput, SidebarTitle } from '@lifeforge/ui'

function DateRangeSelector() {
  const { t } = useTranslation('apps.wallet')
  const [searchParams, setSearchParams] = useSearchParams()

  const handleDateChange = (date: string, type: 'start_date' | 'end_date') => {
    if (date === '') {
      searchParams.delete(type)
      setSearchParams(searchParams)
      return
    }

    const otherType = type === 'start_date' ? 'end_date' : 'start_date'
    const otherDate =
      searchParams.get(otherType) !== null &&
      dayjs(searchParams.get(otherType)).isValid()
        ? dayjs(searchParams.get(otherType))
        : dayjs()

    if (
      (type === 'start_date' && dayjs(date).isAfter(otherDate)) ||
      (type === 'end_date' && dayjs(date).isBefore(otherDate))
    ) {
      searchParams.set(otherType, dayjs(date).format('YYYY-MM-DD'))
    }

    searchParams.set(type, dayjs(date).format('YYYY-MM-DD'))

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
              dayjs(searchParams.get(type)).isValid()
                ? dayjs(searchParams.get(type)).format('YYYY-MM-DD')
                : ''
            }
            hasMargin={false}
            icon={icon}
            index={idx}
            name={name}
            namespace="apps.wallet"
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
