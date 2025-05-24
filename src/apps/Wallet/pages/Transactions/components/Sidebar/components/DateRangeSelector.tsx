import clsx from 'clsx'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { DateInput, SidebarTitle } from '@lifeforge/ui'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

function DateRangeSelector() {
  const { t } = useTranslation('apps.wallet')
  const { startDate, endDate, setStartDate, setEndDate } = useWalletStore()

  const handleDateChange = (
    date: Date | null,
    type: 'start_date' | 'end_date'
  ) => {
    if (!date) {
      if (type === 'start_date') {
        setStartDate(null)
      } else {
        setEndDate(null)
      }
      return
    }

    const otherDate =
      type === 'start_date'
        ? endDate !== null && dayjs(endDate).isValid()
          ? dayjs(endDate)
          : dayjs()
        : startDate !== null && dayjs(startDate).isValid()
          ? dayjs(startDate)
          : dayjs()

    if (
      (type === 'start_date' && dayjs(date).isAfter(otherDate)) ||
      (type === 'end_date' && dayjs(date).isBefore(otherDate))
    ) {
      if (type === 'start_date') {
        setEndDate(dayjs(date).format('YYYY-MM-DD'))
      } else {
        setStartDate(dayjs(date).format('YYYY-MM-DD'))
      }
    }

    if (type === 'start_date') {
      setStartDate(dayjs(date).format('YYYY-MM-DD'))
    } else {
      setEndDate(dayjs(date).format('YYYY-MM-DD'))
    }
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
            className={clsx('w-full', idx === 1 ? 'mt-4!' : 'mt-0')}
            date={
              (type === 'start_date' ? startDate : endDate) !== null &&
              dayjs(type === 'start_date' ? startDate : endDate).isValid()
                ? dayjs(type === 'start_date' ? startDate : endDate).toDate()
                : null
            }
            icon={icon}
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
