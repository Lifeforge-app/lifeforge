import type {
  IWalletAsset,
  IWalletCategory,
  IWalletLedger,
  IWalletTransaction
} from '@apps/Wallet/interfaces/wallet_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

import { useFilteredTransactions } from './useFilteredTransactions'

export function useWalletData() {
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

  const filteredTransactions = useFilteredTransactions(
    transactionsQuery.data ?? []
  )

  const isLoading =
    transactionsQuery.isLoading ||
    assetsQuery.isLoading ||
    ledgersQuery.isLoading ||
    categoriesQuery.isLoading
  const isError =
    transactionsQuery.isError ||
    assetsQuery.isError ||
    ledgersQuery.isError ||
    categoriesQuery.isError

  return {
    transactionsQuery,
    assetsQuery,
    ledgersQuery,
    categoriesQuery,
    filteredTransactions,
    isLoading,
    isError
  }
}
