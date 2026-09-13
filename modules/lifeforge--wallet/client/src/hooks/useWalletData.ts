import { useQuery } from '@tanstack/react-query'

import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/manifest'

export type WalletTransaction = InferOutput<
  typeof forgeAPI.transactions.list
>[number]

export type WalletAsset = InferOutput<typeof forgeAPI.assets.list>[number]

export type WalletLedger = InferOutput<typeof forgeAPI.ledgers.list>[number]

export type WalletCategory = InferOutput<
  typeof forgeAPI.categories.list
>[number]

export type WalletTemplate = InferOutput<typeof forgeAPI.templates.list>[
  'income' | 'expenses'][number]

export function useWalletData() {
  const transactionsQuery = useQuery(forgeAPI.transactions.list.queryOptions())
  const assetsQuery = useQuery(forgeAPI.assets.list.queryOptions())
  const ledgersQuery = useQuery(forgeAPI.ledgers.list.queryOptions())
  const categoriesQuery = useQuery(forgeAPI.categories.list.queryOptions())
  const templatesQuery = useQuery(forgeAPI.templates.list.queryOptions())

  const typesCountQuery = useQuery(
    forgeAPI.analytics.getTypesCount.queryOptions()
  )

  return {
    transactionsQuery,
    assetsQuery,
    ledgersQuery,
    categoriesQuery,
    templatesQuery,
    typesCountQuery
  }
}
