import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { useMemo } from 'react'

import type { WalletTransaction } from '../pages/Transactions'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

interface FilterParams {
  type: string
  category: string
  asset: string
  ledger: string
  startDate: string
  endDate: string
  searchQuery: string
}

export function useFilteredTransactions(
  transactions: WalletTransaction[],
  filters: FilterParams
) {
  const { type, category, asset, ledger, startDate, endDate, searchQuery } =
    filters

  return useMemo(() => {
    return transactions
      .filter(tx => (type ? tx.type === type : true))
      .filter(tx => {
        if (!category) return true
        if (tx.type === 'transfer') return false

        return tx.category === category
      })
      .filter(tx => {
        if (!asset) return true

        if (tx.type === 'transfer') return tx.from === asset || tx.to === asset

        return tx.asset === asset
      })
      .filter(tx => {
        if (!ledger) return true

        if (tx.type === 'transfer') return false

        return tx.ledgers?.includes(ledger)
      })
      .filter(
        tx =>
          searchQuery === '' ||
          (tx.type !== 'transfer'
            ? tx.particulars
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              tx.location_name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
            : false)
      )
      .filter(tx => {
        const start = (
          startDate && dayjs(startDate).isValid()
            ? dayjs(startDate)
            : dayjs('1900-01-01')
        ).startOf('day')

        const end = (
          endDate && dayjs(endDate).isValid() ? dayjs(endDate) : dayjs()
        ).endOf('day')

        const date = dayjs(tx.date)

        return date.isSameOrAfter(start) && date.isSameOrBefore(end)
      })
  }, [
    transactions,
    type,
    category,
    asset,
    ledger,
    startDate,
    endDate,
    searchQuery
  ])
}
