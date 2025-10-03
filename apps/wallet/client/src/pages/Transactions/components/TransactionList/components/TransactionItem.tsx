import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  ItemWrapper,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import type { WalletTransaction } from '../../..'
import ModifyTransactionsModal from '../../../modals/ModifyTransactionsModal'
import ViewTransactionModal from '../../../modals/ViewTransactionModal'
import TransactionIncomeExpensesItem from './TransactionIncomeExpensesItem'
import TransactionTransferItem from './TransactionTransferItem'

function TransactionItem({ transaction }: { transaction: WalletTransaction }) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const handleEditTransaction = useCallback(() => {
    open(ModifyTransactionsModal, {
      type: 'update',
      initialData: transaction
    })
  }, [transaction])

  const deleteMutation = useMutation(
    forgeAPI.wallet.transactions.remove
      .input({ id: transaction.id })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['wallet'] })
        },
        onError: () => {
          toast.error('Failed to delete transaction')
        }
      })
  )

  const handleDeleteTransaction = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Transaction',
      description: 'Are you sure you want to delete this transaction?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [transaction])

  const handleViewTransaction = useCallback(() => {
    open(ViewTransactionModal, {
      transaction
    })
  }, [transaction])

  return (
    <ItemWrapper
      isInteractive
      className="flex-between flex gap-3"
      onClick={handleViewTransaction}
    >
      {transaction.type === 'transfer' ? (
        <TransactionTransferItem transaction={transaction} />
      ) : (
        <TransactionIncomeExpensesItem transaction={transaction} />
      )}
      <ContextMenu>
        <ContextMenuItem
          icon="tabler:pencil"
          label="Edit"
          onClick={handleEditTransaction}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={handleDeleteTransaction}
        />
      </ContextMenu>
    </ItemWrapper>
  )
}

export default TransactionItem
