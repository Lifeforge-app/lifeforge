import { useDebounce } from '@uidotdev/usehooks'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { IWalletTransaction } from '../pages/Transactions'
import { useWalletStore } from '../stores/useWalletStore'

export function useFilteredTransactions(transactions: IWalletTransaction[]) {
  const {
    selectedType,
    selectedCategory,
    selectedAsset,
    selectedLedger,
    startDate,
    endDate,
    searchQuery
  } = useWalletStore()

  const debouncedQuery = useDebounce(searchQuery.trim(), 300)

  return useMemo(() => {
    return transactions
      .filter(
        tx =>
          (selectedType === null || tx.type === selectedType) &&
          (tx.type !== 'transfer'
            ? (selectedCategory === null || tx.category === selectedCategory) &&
              (selectedAsset === null || tx.asset === selectedAsset) &&
              (selectedLedger === null || tx.ledgers.includes(selectedLedger))
            : true)
      )
      .filter(tx =>
        tx.type !== 'transfer'
          ? debouncedQuery === '' ||
            tx.particulars
              ?.toLowerCase()
              .includes(debouncedQuery.toLowerCase()) ||
            tx.location_name
              ?.toLowerCase()
              .includes(debouncedQuery.toLowerCase())
          : true
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
    selectedType,
    selectedCategory,
    selectedAsset,
    selectedLedger,
    startDate,
    endDate,
    debouncedQuery
  ])
}
