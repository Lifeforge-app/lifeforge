import { useDebounce } from '@uidotdev/usehooks'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import useFetch from '@hooks/useFetch'
import {
  type IWalletTransactionEntry,
  type IWalletLedgerEntry,
  type IWalletAssetEntry,
  type IWalletCategoryEntry,
  type IWalletIncomeExpenses
} from '@interfaces/wallet_interfaces'

interface IWalletData {
  transactions: IWalletTransactionEntry[] | 'loading' | 'error'
  filteredTransactions: IWalletTransactionEntry[]
  ledgers: IWalletLedgerEntry[] | 'loading' | 'error'
  assets: IWalletAssetEntry[] | 'loading' | 'error'
  categories: IWalletCategoryEntry[] | 'loading' | 'error'
  incomeExpenses: IWalletIncomeExpenses | 'loading' | 'error'
  refreshTransactions: () => void
  refreshAssets: () => void
  refreshLedgers: () => void
  refreshCategories: () => void
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

export const WalletContext = React.createContext<IWalletData | undefined>(
  undefined
)

export default function WalletProvider(): React.ReactElement {
  const [searchParams] = useSearchParams()
  const [transactions, refreshTransactions] = useFetch<
    IWalletTransactionEntry[]
  >('wallet/transactions')
  const [assets, refreshAssets] = useFetch<IWalletAssetEntry[]>('wallet/assets')
  const [ledgers, refreshLedgers] =
    useFetch<IWalletLedgerEntry[]>('wallet/ledgers')
  const [categories, refreshCategories] =
    useFetch<IWalletCategoryEntry[]>('wallet/category')
  const [incomeExpenses] = useFetch<IWalletIncomeExpenses>(
    `wallet/transactions/income-expenses/${new Date().getFullYear()}/${new Date().getMonth()}`
  )
  const [filteredTransactions, setFilteredTransactions] = useState<
    IWalletTransactionEntry[]
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
