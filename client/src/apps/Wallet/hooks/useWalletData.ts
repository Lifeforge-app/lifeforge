import { useAPIQuery } from 'shared'

import { WalletControllersSchemas } from 'shared/types/controllers'

import { useFilteredTransactions } from './useFilteredTransactions'

export function useWalletData() {
  const transactionsQuery = useAPIQuery<
    WalletControllersSchemas.ITransactions['getAllTransactions']['response']
  >('wallet/transactions', ['wallet', 'transactions'])

  const assetsQuery = useAPIQuery<
    WalletControllersSchemas.IAssets['getAllAssets']['response']
  >('wallet/assets', ['wallet', 'assets'])

  const ledgersQuery = useAPIQuery<
    WalletControllersSchemas.ILedgers['getAllLedgers']['response']
  >('wallet/ledgers', ['wallet', 'ledgers'])

  const categoriesQuery = useAPIQuery<
    WalletControllersSchemas.ICategories['getAllCategories']['response']
  >('wallet/categories', ['wallet', 'categories'])

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
