import React from 'react'
import { type IWalletTransactionEntry } from '@interfaces/wallet_interfaces'
import TableBody from './components/TableBody'
import TableHeader from './components/TableHeader'

function TableView({
  visibleColumn,
  setModifyModalOpenType,
  setSelectedData,
  setDeleteTransactionsConfirmationOpen
}: {
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
    <table className="mb-8 w-max">
      <TableHeader visibleColumn={visibleColumn} />
      <TableBody
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
