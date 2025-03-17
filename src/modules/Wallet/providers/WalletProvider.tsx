import { useDebounce } from '@uidotdev/usehooks'
import moment from 'moment'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router'

import {
  type IWalletAsset,
  type IWalletCategory,
  type IWalletIncomeExpenses,
  type IWalletLedger,
  type IWalletTransaction
} from '@modules/Wallet/interfaces/wallet_interfaces'

import { type Loadable } from '@interfaces/common'

import useAPIQuery from '@hooks/useAPIQuery'
import useFetch from '@hooks/useFetch'

interface IWalletData {
  transactions: Loadable<IWalletTransaction[]>
  filteredTransactions: IWalletTransaction[]
  ledgers: IWalletLedger[]
  ledgersLoading: boolean
  assets: IWalletAsset[]
  assetsLoading: boolean
  categories: IWalletCategory[]
  categoriesLoading: boolean
  incomeExpenses: IWalletIncomeExpenses
  incomeExpensesLoading: boolean
  refreshTransactions: () => void
  isAmountHidden: boolean
  toggleAmountVisibility: React.Dispatch<React.SetStateAction<boolean>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

export const WalletContext = createContext<IWalletData | undefined>(undefined)

export default function WalletProvider() {
  const [searchParams] = useSearchParams()
  const [isAmountHidden, toggleAmountVisibility] = useState(true)
  const [transactions, refreshTransactions] = useFetch<IWalletTransaction[]>(
    'wallet/transactions'
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
  const incomeExpensesQuery = useAPIQuery<IWalletIncomeExpenses>(
    `wallet/transactions/income-expenses?year=${new Date().getFullYear()}&month=${
      new Date().getMonth() + 1
    }`,
    ['wallet', 'transactions', 'income-expenses']
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
      ledgers: ledgersQuery.data ?? [],
      ledgersLoading: ledgersQuery.isLoading,
      assets: assetsQuery.data ?? [],
      assetsLoading: assetsQuery.isLoading,
      categories: categoriesQuery.data ?? [],
      categoriesLoading: categoriesQuery.isLoading,
      incomeExpenses: incomeExpensesQuery.data ?? {
        monthlyExpenses: 0,
        monthlyIncome: 0,
        totalExpenses: 0,
        totalIncome: 0
      },
      incomeExpensesLoading: incomeExpensesQuery.isLoading,
      refreshTransactions,
      isAmountHidden,
      toggleAmountVisibility,
      searchQuery,
      setSearchQuery
    }),
    [
      transactions,
      filteredTransactions,
      ledgersQuery.data,
      ledgersQuery.isLoading,
      assetsQuery.data,
      assetsQuery.isLoading,
      categoriesQuery.data,
      categoriesQuery.isLoading,
      incomeExpensesQuery.data,
      incomeExpensesQuery.isLoading,
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
