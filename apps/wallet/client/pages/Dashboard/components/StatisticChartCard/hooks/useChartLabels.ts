import { useWalletData } from '@modules/wallet/client/hooks/useWalletData'
import dayjs from 'dayjs'
import { useMemo } from 'react'

export function useChartLabels(range: 'week' | 'month' | 'ytd') {
  const { transactionsQuery } = useWalletData()

  const transactions = transactionsQuery.data ?? []

  return useMemo(() => {
    const now = dayjs()

    switch (range) {
      case 'week': {
        const startOfWeek = now.startOf('week') // Sunday

        const days = []

        for (let i = 0; i <= 6; i++) {
          days.push(startOfWeek.add(i, 'day').format('MMM DD'))
        }

        return days
      }

      case 'month': {
        const startOfMonth = now.startOf('month')

        const endOfMonth = now.endOf('month')

        const days = []

        for (let i = 0; i <= endOfMonth.date() - 1; i++) {
          days.push(startOfMonth.add(i, 'day').format('MMM DD'))
        }

        return days
      }

      case 'ytd': {
        const months = []

        for (let i = 0; i <= now.month(); i++) {
          months.push(dayjs().month(i).format('MMM'))
        }

        return months
      }

      default:
        return []
    }
  }, [transactions, range])
}
