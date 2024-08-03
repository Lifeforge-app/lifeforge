import { useDebounce } from '@uidotdev/usehooks'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import useFetch from '@hooks/useFetch'
import {
  type IWalletTransaction,
  type IWalletLedger,
  type IWalletAsset,
  type IWalletCategory,
  type IWalletIncomeExpenses
} from '@interfaces/wallet_interfaces'

interface IWalletData {
  transactions: IWalletTransaction[] | 'loading' | 'error'
  filteredTransactions: IWalletTransaction[]
  ledgers: IWalletLedger[] | 'loading' | 'error'
  assets: IWalletAsset[] | 'loading' | 'error'
  categories: IWalletCategory[] | 'loading' | 'error'
  incomeExpenses: IWalletIncomeExpenses | 'loading' | 'error'
  refreshTransactions: () => void
  refreshAssets: () => void
  refreshLedgers: () => void
  refreshCategories: () => void
  refreshIncomeExpenses: () => void
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

export const WalletContext = React.createContext<IWalletData | undefined>(
  undefined
)

export default function WalletProvider(): React.ReactElement {
  const [searchParams] = useSearchParams()
  const [transactions, refreshTransactions] = useFetch<IWalletTransaction[]>(
    'wallet/transactions'
  )
  const [assets, refreshAssets] = useFetch<IWalletAsset[]>('wallet/assets')
  const [ledgers, refreshLedgers] = useFetch<IWalletLedger[]>('wallet/ledgers')
  const [categories, refreshCategories] =
    useFetch<IWalletCategory[]>('wallet/category')
  const [incomeExpenses, refreshIncomeExpenses] =
    useFetch<IWalletIncomeExpenses>(
      `wallet/transactions/income-expenses/${new Date().getFullYear()}/${
        new Date().getMonth() + 1
      }`
    )
  const [filteredTransactions, setFilteredTransactions] = useState<
    IWalletTransaction[]
  >([])
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

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
          if (transaction.amount === 400) {
            console.log(
              moment(transaction.date).format('YYYY-MM-DD'),
              startDate.format('YYYY-MM-DD'),
              endDate.format('YYYY-MM-DD'),
              moment(transaction.date).isSameOrAfter(startDate) &&
                moment(transaction.date).isSameOrBefore(endDate)
            )
          }
          const transactionDate = moment(transaction.date).format('YYYY-MM-DD')
          return (
            moment(transactionDate).isSameOrAfter(startDate) &&
            moment(transactionDate).isSameOrBefore(endDate)
          )
        })
    )
  }, [searchParams, transactions, debouncedSearchQuery])

  return (
    <WalletContext
      value={{
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
        searchQuery,
        setSearchQuery
      }}
    >
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
