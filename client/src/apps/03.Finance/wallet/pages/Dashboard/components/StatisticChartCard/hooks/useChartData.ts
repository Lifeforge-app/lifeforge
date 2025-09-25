import dayjs from 'dayjs'
import { useMemo } from 'react'

import { useWalletData } from '@apps/03.Finance/wallet/hooks/useWalletData'

export function useChartData(
  labels: string[],
  range: 'week' | 'month' | 'ytd'
) {
  const { transactionsQuery } = useWalletData()

  const transactions = transactionsQuery.data ?? []

  const getTransactions = (date: string, type: 'income' | 'expenses') => {
    if (range === 'ytd') {
      return transactions
        .filter(transaction => transaction.type === type)
        .filter(transaction => dayjs(transaction.date).format('MMM') === date)
        .reduce((acc, curr) => acc + curr.amount, 0)
    } else {
      return transactions
        .filter(transaction => transaction.type === type)
        .filter(
          transaction => dayjs(transaction.date).format('MMM DD') === date
        )
        .reduce((acc, curr) => acc + curr.amount, 0)
    }
  }

  return useMemo(() => {
    return (['income', 'expenses'] as const).map(type => {
      return labels
        .map(date => getTransactions(date, type))
        .map(amount => (amount === 0 ? 0.1 : amount))
    })
  }, [transactions, range, labels, getTransactions])
}
