import { useDebounce } from '@uidotdev/usehooks'
import moment from 'moment'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router'
import { useSearchParams } from 'react-router'
import useFetch from '@hooks/useFetch'
import { type Loadable } from '@interfaces/common'
import {
  type IWalletAsset,
  type IWalletCategory,
  type IWalletIncomeExpenses,
  type IWalletLedger,
  type IWalletTransaction
} from '@interfaces/wallet_interfaces'

interface IWalletData {
  transactions: Loadable<IWalletTransaction[]>
  filteredTransactions: IWalletTransaction[]
  ledgers: Loadable<IWalletLedger[]>
  assets: Loadable<IWalletAsset[]>
  categories: Loadable<IWalletCategory[]>
  incomeExpenses: Loadable<IWalletIncomeExpenses>
  refreshTransactions: () => void
  refreshAssets: () => void
  refreshLedgers: () => void
  refreshCategories: () => void
  refreshIncomeExpenses: () => void
  isAmountHidden: boolean
  toggleAmountVisibility: React.Dispatch<React.SetStateAction<boolean>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

export const WalletContext = React.createContext<IWalletData | undefined>(
  undefined
)

export default function WalletProvider(): React.ReactElement {
  const [searchParams] = useSearchParams()
  const [isAmountHidden, toggleAmountVisibility] = useState(true)
  const [transactions, refreshTransactions] = useFetch<IWalletTransaction[]>(
    'wallet/transactions'
  )
  const [assets, refreshAssets] = useFetch<IWalletAsset[]>('wallet/assets')
  const [ledgers, refreshLedgers] = useFetch<IWalletLedger[]>('wallet/ledgers')
  const [categories, refreshCategories] =
    useFetch<IWalletCategory[]>('wallet/categories')
  const [incomeExpenses, refreshIncomeExpenses] =
    useFetch<IWalletIncomeExpenses>(
      `wallet/transactions/income-expenses?year=${new Date().getFullYear()}&month=${
        new Date().getMonth() + 1
      }`
    )
  const [filteredTransactions, setFilteredTransactions] = useState<
    IWalletTransaction[]
  >([])
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)

  useEffect(() => {
    if (typeof transactions === 'string') return

    setFilteredTransactions(
      transactions
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
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase()) ||
            transaction.location
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase())
          )
        })
        .filter(transaction => {
          const startDate =
            searchParams.get('start_date') !== null &&
            moment(searchParams.get('start_date')).isValid()
              ? moment(searchParams.get('start_date'))
              : moment('1900-01-01')
          const endDate =
            searchParams.get('end_date') !== null &&
            moment(searchParams.get('end_date')).isValid()
              ? moment(searchParams.get('end_date'))
              : moment()

          const transactionDate = moment(transaction.date).format('YYYY-MM-DD')
          return (
            moment(transactionDate).isSameOrAfter(startDate) &&
            moment(transactionDate).isSameOrBefore(endDate)
          )
        })
    )
  }, [searchParams, transactions, debouncedSearchQuery])

  const value = useMemo(
    () => ({
      transactions,
      filteredTransactions,
      ledgers,
      assets,
      categories,
      incomeExpenses,
      refreshTransactions,
      refreshAssets,
      refreshLedgers,
      refreshCategories,
      refreshIncomeExpenses,
      isAmountHidden,
      toggleAmountVisibility,
      searchQuery,
      setSearchQuery
    }),
    [
      transactions,
      filteredTransactions,
      ledgers,
      assets,
      categories,
      incomeExpenses,
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
