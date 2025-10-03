import dayjs from 'dayjs'
import { useMemo } from 'react'

import { useWalletData } from './useWalletData'

export default function useYearMonthOptions(year: number | null) {
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

  return { yearsOptions, monthsOptions }
}
