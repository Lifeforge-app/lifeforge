import dayjs from 'dayjs'
import { ListboxInput, ListboxOption } from 'lifeforge-ui'
import { useEffect, useMemo } from 'react'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

function YearMonthInput({
  month,
  setMonth,
  year,
  setYear
}: {
  month: number | null
  setMonth: (value: number | null) => void
  year: number | null
  setYear: (value: number | null) => void
}) {
  const { transactionsQuery } = useWalletData()

  const transactions = transactionsQuery.data ?? []

  const yearsOptions = useMemo(() => {
    if (typeof transactions === 'string') return []

    return Array.from(
      new Set(transactions.map(transaction => dayjs(transaction.date).year()))
    )
  }, [transactions])

  const monthsOptions = useMemo(() => {
    if (typeof transactions === 'string' || year === null) return []

    return Array.from(
      new Set(
        transactions
          .filter(transaction => dayjs(transaction.date).year() === year)
          .map(transaction => dayjs(transaction.date).month())
      )
    )
  }, [transactions, year])

  useEffect(() => {
    if (yearsOptions.length > 0) {
      setYear(yearsOptions[0])
    }
  }, [yearsOptions])

  useEffect(() => {
    if (monthsOptions.length > 0) {
      setMonth(monthsOptions[0])
    }
  }, [monthsOptions])

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <ListboxInput
        buttonContent={
          <>
            <span className="-mt-px block truncate">
              {month !== null ? dayjs().month(month).format('MMMM') : 'None'}
            </span>
          </>
        }
        className="w-full sm:w-1/2"
        icon="tabler:calendar-month"
        name="Month"
        namespace="apps.wallet"
        setValue={setMonth}
        value={month}
      >
        {monthsOptions.map(mon => (
          <ListboxOption
            key={mon}
            text={dayjs().month(mon).format('MMMM')}
            value={mon}
          />
        ))}
      </ListboxInput>
      <ListboxInput
        buttonContent={
          <>
            <span className="-mt-px block truncate">{year ?? 'None'}</span>
          </>
        }
        className="w-full sm:w-1/2"
        icon="tabler:calendar"
        name="Year"
        namespace="apps.wallet"
        setValue={setYear}
        value={year}
      >
        {yearsOptions.map(yr => (
          <ListboxOption key={yr} text={yr.toString()} value={yr} />
        ))}
      </ListboxInput>
    </div>
  )
}

export default YearMonthInput
