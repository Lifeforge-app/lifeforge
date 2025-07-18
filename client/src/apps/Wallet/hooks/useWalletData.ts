import { useAPIQuery } from 'shared/lib'

import type {
  IWalletAsset,
  IWalletCategory,
  IWalletLedger,
  IWalletTransaction
} from '@apps/Wallet/interfaces/wallet_interfaces'

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

  const typesCountQuery = useAPIQuery<
    Record<
      string,
      {
        amount: number
        accumulate: number
      }
    >
  >('wallet/utils/types-count', ['wallet', 'transactions', 'types-count'])

  const filteredTransactions = useFilteredTransactions(
    transactionsQuery.data ?? []
  )

  return {
    transactionsQuery,
    assetsQuery,
    ledgersQuery,
    categoriesQuery,
    filteredTransactions,
    typesCountQuery
  }
}
