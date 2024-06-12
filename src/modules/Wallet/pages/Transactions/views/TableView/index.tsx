import React from 'react'
import {
  type IWalletAssetEntry,
  type IWalletCategoryEntry,
  type IWalletLedgerEntry,
  type IWalletTransactionEntry
} from '@interfaces/wallet_interfaces'
import TableBody from './components/TableBody'
import TableHeader from './components/TableHeader'

function TableView({
  transactions,
  ledgers,
  assets,
  categories,
  visibleColumn,
  setModifyModalOpenType,
  setSelectedData,
  setDeleteTransactionsConfirmationOpen
}: {
  transactions: IWalletTransactionEntry[]
  ledgers: IWalletLedgerEntry[]
  assets: IWalletAssetEntry[]
  categories: IWalletCategoryEntry[]
  visibleColumn: string[]
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setSelectedData: React.Dispatch<
    React.SetStateAction<IWalletTransactionEntry | null>
  >
  setDeleteTransactionsConfirmationOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  return (
    <table className="mb-8 w-full">
      <TableHeader visibleColumn={visibleColumn} />
      <TableBody
        transactions={transactions}
        ledgers={ledgers}
        assets={assets}
        categories={categories}
        visibleColumn={visibleColumn}
        setModifyModalOpenType={setModifyModalOpenType}
        setSelectedData={setSelectedData}
        setDeleteTransactionsConfirmationOpen={
          setDeleteTransactionsConfirmationOpen
        }
      />
    </table>
  )
}

export default TableView
