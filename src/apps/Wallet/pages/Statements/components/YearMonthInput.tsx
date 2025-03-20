import dayjs from 'dayjs'
import { useEffect, useMemo } from 'react'

import { ListboxOrComboboxInput, ListboxOrComboboxOption } from '@lifeforge/ui'

import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

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
  const { transactionsQuery } = useWalletContext()
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
    <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
      <ListboxOrComboboxInput
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
        type="listbox"
        value={month}
      >
        {monthsOptions.map(mon => (
          <ListboxOrComboboxOption
            key={mon}
            text={dayjs().month(mon).format('MMMM')}
            value={mon}
          />
        ))}
      </ListboxOrComboboxInput>
      <ListboxOrComboboxInput
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
        type="listbox"
        value={year}
      >
        {yearsOptions.map(yr => (
          <ListboxOrComboboxOption key={yr} text={yr.toString()} value={yr} />
        ))}
      </ListboxOrComboboxInput>
    </div>
  )
}

export default YearMonthInput
