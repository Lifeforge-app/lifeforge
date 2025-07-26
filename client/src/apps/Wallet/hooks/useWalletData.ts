import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferOutput } from 'lifeforge-api'

import { useFilteredTransactions } from './useFilteredTransactions'

export type WalletTransaction = InferOutput<
  typeof forgeAPI.wallet.transactions.list
>[number]

export type WalletAsset = InferOutput<
  typeof forgeAPI.wallet.assets.list
>[number]

export type WalletLedger = InferOutput<
  typeof forgeAPI.wallet.ledgers.list
>[number]

export type WalletCategory = InferOutput<
  typeof forgeAPI.wallet.categories.list
>[number]

export function useWalletData() {
  const transactionsQuery = useQuery(
    forgeAPI.wallet.transactions.list.queryOptions()
  )

  const assetsQuery = useQuery(forgeAPI.wallet.assets.list.queryOptions())

  const ledgersQuery = useQuery(forgeAPI.wallet.ledgers.list.queryOptions())

  const categoriesQuery = useQuery(
    forgeAPI.wallet.categories.list.queryOptions()
  )

  const typesCountQuery = useQuery(
    forgeAPI.wallet.utils.getTypesCount.queryOptions()
  )

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
