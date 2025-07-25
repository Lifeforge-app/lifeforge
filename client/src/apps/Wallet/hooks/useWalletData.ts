import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'

import { useFilteredTransactions } from './useFilteredTransactions'

export function useWalletData() {
  const transactionsQuery = useQuery(
    forgeAPI.wallet.transactions.list.getQueryOptions()
  )

  const assetsQuery = useQuery(forgeAPI.wallet.assets.list.getQueryOptions())

  const ledgersQuery = useQuery(forgeAPI.wallet.ledgers.list.getQueryOptions())

  const categoriesQuery = useQuery(
    forgeAPI.wallet.categories.list.getQueryOptions()
  )

  const typesCountQuery = useQuery(
    forgeAPI.wallet.utils.getTypesCount.getQueryOptions()
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
