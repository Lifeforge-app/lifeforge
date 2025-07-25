import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'

import { useFilteredTransactions } from './useFilteredTransactions'

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
