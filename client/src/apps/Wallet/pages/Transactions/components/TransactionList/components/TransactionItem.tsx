import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
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
      buttonType: 'delete',
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
    <div
      className={clsx(
        'flex-between component-bg-with-hover shadow-custom relative flex w-full min-w-0 gap-4 rounded-md p-4'
      )}
      role="button"
      tabIndex={0}
      onClick={handleViewTransaction}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleViewTransaction()
        }
      }}
    >
      {transaction.type === 'transfer' ? (
        <TransactionTransferItem transaction={transaction} />
      ) : (
        <TransactionIncomeExpensesItem transaction={transaction} />
      )}
      <ContextMenu>
        <ContextMenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={handleEditTransaction}
        />
        <ContextMenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={handleDeleteTransaction}
        />
      </ContextMenu>
    </div>
  )
}

export default TransactionItem
