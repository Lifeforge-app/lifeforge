import dayjs from 'dayjs'
import { useMemo } from 'react'

import type { WalletTransaction } from '@apps/03.Finance/wallet/pages/Transactions'

interface TransactionCount {
  income: number
  expenses: number
  transfer: number
  total: number
  count: number
}

function useTransactionCountMap({
  transactions,
  currentMonth,
  currentYear,
  viewsFilter
}: {
  transactions: WalletTransaction[]
  currentMonth: number
  currentYear: number
  viewsFilter: ('income' | 'expenses' | 'transfer')[]
}) {
  return useMemo<Record<string, TransactionCount>>(() => {
    if (typeof transactions === 'string') {
      return {}
    }

    const countMap: Record<string, TransactionCount> = {}

    transactions.forEach(transaction => {
      const transactionDate = dayjs(transaction.date, 'YYYY-M-D')

      if (
        !(
          transactionDate.month() === currentMonth &&
          transactionDate.year() === currentYear
        )
      ) {
        return
      }

      const dateKey = transactionDate.format('YYYY-M-D')

      if (!countMap[dateKey]) {
        countMap[dateKey] = {
          income: 0,
          expenses: 0,
          transfer: 0,
          total: 0,
          count: 0
        }
      }

      if (!viewsFilter.includes(transaction.type)) {
        return
      }

      if (transaction.type === 'income') {
        countMap[dateKey].income += transaction.amount
      } else if (transaction.type === 'expenses') {
        countMap[dateKey].expenses += transaction.amount
      } else if (transaction.type === 'transfer') {
        countMap[dateKey].transfer += transaction.amount / 2
      }

      countMap[dateKey].total +=
        transaction.amount / (transaction.type === 'transfer' ? 2 : 1)
      countMap[dateKey].count += 1 / (transaction.type === 'transfer' ? 2 : 1)
    })

    return countMap
  }, [transactions, currentMonth, currentYear, viewsFilter])
}

export default useTransactionCountMap
