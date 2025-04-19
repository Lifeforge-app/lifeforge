import { UseQueryResult } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import dayjs from 'dayjs'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router'

import {
  type IWalletAsset,
  type IWalletCategory,
  type IWalletLedger,
  type IWalletTransaction
} from '@apps/Wallet/interfaces/wallet_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

interface IWalletData {
  transactionsQuery: UseQueryResult<IWalletTransaction[]>
  filteredTransactions: IWalletTransaction[]
  ledgersQuery: UseQueryResult<IWalletLedger[]>
  assetsQuery: UseQueryResult<IWalletAsset[]>
  categoriesQuery: UseQueryResult<IWalletCategory[]>
  isAmountHidden: boolean
  toggleAmountVisibility: React.Dispatch<React.SetStateAction<boolean>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

export const WalletContext = createContext<IWalletData | undefined>(undefined)

export default function WalletProvider() {
  const [searchParams] = useSearchParams()
  const [isAmountHidden, toggleAmountVisibility] = useState(true)
  const transactionsQuery = useAPIQuery<IWalletTransaction[]>(
    'wallet/transactions',
    ['wallet', 'transactions']
  )
  const assetsQuery = useAPIQuery<IWalletAsset[]>('wallet/assets', [
    'wallet',
    'assets'
  ])
  const ledgersQuery = useAPIQuery<IWalletLedger[]>('wallet/ledgers', [
    'wallet',
    'ledgers'
  ])
  const categoriesQuery = useAPIQuery<IWalletCategory[]>('wallet/categories', [
    'wallet',
    'categories'
  ])
  const [filteredTransactions, setFilteredTransactions] = useState<
    IWalletTransaction[]
  >([])
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)

  useEffect(() => {
    if (transactionsQuery.isLoading || !transactionsQuery.data) return

    setFilteredTransactions(
      transactionsQuery.data
        .filter(transaction => {
          return ['type', 'category', 'asset', 'ledger'].every(
            item =>
              ['all', null].includes(searchParams.get(item)) ||
              transaction[item as 'type' | 'category' | 'asset' | 'ledger'] ===
                searchParams.get(item)
          )
        })
        .filter(transaction => {
          return (
            debouncedSearchQuery === '' ||
            transaction.particulars
              ?.toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase()) ||
            transaction.location
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase())
          )
        })
        .filter(transaction => {
          const startDate =
            searchParams.get('start_date') !== null &&
            dayjs(searchParams.get('start_date')).isValid()
              ? dayjs(searchParams.get('start_date'))
              : dayjs('1900-01-01')
          const endDate =
            searchParams.get('end_date') !== null &&
            dayjs(searchParams.get('end_date')).isValid()
              ? dayjs(searchParams.get('end_date'))
              : dayjs()

          const transactionDate = dayjs(transaction.date).format('YYYY-MM-DD')
          return (
            dayjs(transactionDate).isSameOrAfter(startDate) &&
            dayjs(transactionDate).isSameOrBefore(endDate)
          )
        })
    )
  }, [
    searchParams,
    transactionsQuery.data,
    transactionsQuery.isLoading,
    debouncedSearchQuery
  ])

  const value = useMemo(
    () => ({
      transactionsQuery,
      filteredTransactions,
      ledgersQuery,
      assetsQuery,
      categoriesQuery,
      isAmountHidden,
      toggleAmountVisibility,
      searchQuery,
      setSearchQuery
    }),
    [
      transactionsQuery,
      filteredTransactions,
      ledgersQuery,
      assetsQuery,
      categoriesQuery,
      isAmountHidden,
      searchQuery
    ]
  )

  return (
    <WalletContext value={value}>
      <Outlet />
    </WalletContext>
  )
}

export function useWalletContext(): IWalletData {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider')
  }
  return context
}
