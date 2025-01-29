import moment from 'moment'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@components/inputs'
import { useWalletContext } from '@providers/WalletProvider'

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
}): React.ReactElement {
  const { t } = useTranslation()
  const { transactions } = useWalletContext()

  const yearsOptions = useMemo(() => {
    if (typeof transactions === 'string') return []

    return Array.from(
      new Set(transactions.map(transaction => moment(transaction.date).year()))
    )
  }, [transactions])

  const monthsOptions = useMemo(() => {
    if (typeof transactions === 'string' || year === null) return []

    return Array.from(
      new Set(
        transactions
          .filter(transaction => moment(transaction.date).year() === year)
          .map(transaction => moment(transaction.date).month())
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
        type="listbox"
        name={t('input.month')}
        icon="tabler:calendar-month"
        value={month}
        setValue={setMonth}
        className="w-full sm:w-1/2"
        buttonContent={
          <>
            <span className="-mt-px block truncate">
              {month !== null ? moment().month(month).format('MMMM') : 'None'}
            </span>
          </>
        }
      >
        {monthsOptions.map(mon => (
          <ListboxOrComboboxOption
            key={mon}
            text={moment().month(mon).format('MMMM')}
            value={mon}
          />
        ))}
      </ListboxOrComboboxInput>
      <ListboxOrComboboxInput
        type="listbox"
        name={t('input.year')}
        icon="tabler:calendar"
        value={year}
        setValue={setYear}
        className="w-full sm:w-1/2"
        buttonContent={
          <>
            <span className="-mt-px block truncate">{year ?? 'None'}</span>
          </>
        }
      >
        {yearsOptions.map(yr => (
          <ListboxOrComboboxOption key={yr} text={yr.toString()} value={yr} />
        ))}
      </ListboxOrComboboxInput>
    </div>
  )
}

export default YearMonthInput
