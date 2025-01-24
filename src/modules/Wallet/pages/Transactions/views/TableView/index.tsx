import React from 'react'
import Scrollbar from '@components/utilities/Scrollbar'
import { type IWalletTransaction } from '@interfaces/wallet_interfaces'
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
    React.SetStateAction<IWalletTransaction | null>
  >
  setDeleteTransactionsConfirmationOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  return (
    <Scrollbar>
      <table className="mb-16 w-max min-w-full">
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
    </Scrollbar>
  )
}

export default TableView
