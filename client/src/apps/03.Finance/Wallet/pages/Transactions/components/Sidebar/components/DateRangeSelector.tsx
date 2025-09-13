import clsx from 'clsx'
import dayjs from 'dayjs'
import { DateInput, SidebarTitle } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { useWalletStore } from '@apps/03.Finance/wallet/stores/useWalletStore'

function DateRangeSelector() {
  const { t } = useTranslation('apps.wallet')

  const { startDate, endDate, setStartDate, setEndDate } = useWalletStore()

  const handleDateChange = (
    date: Date | null,
    type: 'start_date' | 'end_date'
  ) => {
    if (!date) {
      if (type === 'start_date') {
        setStartDate(undefined)
      } else {
        setEndDate(undefined)
      }

      return
    }

    const otherDate =
      type === 'start_date'
        ? endDate !== undefined && dayjs(endDate).isValid()
          ? dayjs(endDate)
          : dayjs()
        : startDate !== undefined && dayjs(startDate).isValid()
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
      <SidebarTitle label={t('sidebar.dateRange')} />
      <div className="px-4">
        {dateInputsConfig.map(({ type, icon, name }, idx) => (
          <DateInput
            key={type}
            className={clsx('w-full', idx === 1 ? 'mt-4!' : 'mt-0')}
            icon={icon}
            label={name}
            namespace="apps.wallet"
            setValue={date => {
              handleDateChange(date, type)
            }}
            value={
              (type === 'start_date' ? startDate : endDate) &&
              dayjs(type === 'start_date' ? startDate : endDate).isValid()
                ? dayjs(type === 'start_date' ? startDate : endDate).toDate()
                : null
            }
          />
        ))}
      </div>
    </>
  )
}

export default DateRangeSelector
