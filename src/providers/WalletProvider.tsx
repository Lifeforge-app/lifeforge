import React, { useContext } from 'react'
import { Outlet } from 'react-router'
import useFetch from '@hooks/useFetch'
import {
  type IWalletTransactionEntry,
  type IWalletLedgerEntry,
  type IWalletAssetEntry,
  type IWalletCategoryEntry
} from '@interfaces/wallet_interfaces'

interface IWalletData {
  transactions: IWalletTransactionEntry[] | 'loading' | 'error'
  ledgers: IWalletLedgerEntry[] | 'loading' | 'error'
  assets: IWalletAssetEntry[] | 'loading' | 'error'
  categories: IWalletCategoryEntry[] | 'loading' | 'error'
  refreshTransactions: () => void
  refreshAssets: () => void
  refreshLedgers: () => void
  refreshCategories: () => void
}

export const WalletContext = React.createContext<IWalletData | undefined>(
  undefined
)

export default function WalletProvider(): React.ReactElement {
  const [transactions, refreshTransactions] = useFetch<
    IWalletTransactionEntry[]
  >('wallet/transactions/list')
  const [assets, refreshAssets] =
    useFetch<IWalletAssetEntry[]>('wallet/assets/list')
  const [ledgers, refreshLedgers] = useFetch<IWalletLedgerEntry[]>(
    'wallet/ledgers/list'
  )
  const [categories, refreshCategories] = useFetch<IWalletCategoryEntry[]>(
    'wallet/category/list'
  )

  return (
    <WalletContext
      value={{
        transactions,
        ledgers,
        assets,
        categories,
        refreshTransactions,
        refreshAssets,
        refreshLedgers,
        refreshCategories
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
