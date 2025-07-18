import { useQueryClient } from '@tanstack/react-query'
import { DeleteConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import ModifyTransactionsModal from '@apps/Wallet/pages/Transactions/modals/ModifyTransactionsModal'

import { type IWalletTransaction } from '../../../../../../interfaces/wallet_interfaces'

function ActionColumn({ transaction }: { transaction: IWalletTransaction }) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const handleEditTransaction = useCallback(() => {
    open(ModifyTransactionsModal, {
      type: 'update',
      existedData: transaction
    })
  }, [transaction])

  const handleDeleteTransaction = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'wallet/transactions',
      data: transaction,
      itemName: 'transaction',
      queryKey: ['wallet', 'transactions'],
      updateDataList: () => {
        queryClient.invalidateQueries({ queryKey: ['wallet', 'categories'] })
        queryClient.invalidateQueries({ queryKey: ['wallet', 'ledgers'] })
        queryClient.invalidateQueries({ queryKey: ['wallet', 'assets'] })
      }
    })
  }, [transaction])

  return (
    <td className="p-2">
      <HamburgerMenu>
        {transaction.type !== 'transfer' && (
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={handleEditTransaction}
          />
        )}
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={handleDeleteTransaction}
        />
      </HamburgerMenu>
    </td>
  )
}

export default ActionColumn
