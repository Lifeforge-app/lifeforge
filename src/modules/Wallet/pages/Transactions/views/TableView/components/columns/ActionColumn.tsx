import React from 'react'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import { type IWalletTransaction } from '@interfaces/wallet_interfaces'

function ActionColumn({
  transaction,
  setSelectedData,
  setModifyModalOpenType,
  setDeleteTransactionsConfirmationOpen
}: {
  transaction: IWalletTransaction
  setSelectedData: React.Dispatch<
    React.SetStateAction<IWalletTransaction | null>
  >
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setDeleteTransactionsConfirmationOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  return (
    <td className="p-2">
      <HamburgerMenu className="relative">
        {transaction.type !== 'transfer' && (
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={() => {
              setSelectedData(transaction)
              setModifyModalOpenType('update')
            }}
          />
        )}
        <MenuItem
          icon="tabler:trash"
          text="Delete"
          isRed
          onClick={() => {
            setSelectedData(transaction)
            setDeleteTransactionsConfirmationOpen(true)
          }}
        />
      </HamburgerMenu>
    </td>
  )
}

export default ActionColumn
