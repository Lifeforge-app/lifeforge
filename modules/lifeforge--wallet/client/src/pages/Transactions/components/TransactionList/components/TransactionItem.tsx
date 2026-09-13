import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { WalletTransaction } from '../../..'
import ModifyTemplatesModal from '../../../modals/ModifyTemplatesModal'
import ModifyTransactionsModal from '../../../modals/ModifyTransactionsModal'
import ViewTransactionModal from '../../../modals/ViewTransactionModal'
import TransactionIncomeExpensesItem from './TransactionIncomeExpensesItem'
import TransactionTransferItem from './TransactionTransferItem'

function TransactionItem({
  transaction,
  viewOnly
}: {
  transaction: WalletTransaction
  viewOnly?: boolean
}) {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()

  const deleteMutation = useForgeMutation(
    forgeAPI.transactions.remove.input({ id: transaction.id }),
    { action: 'delete', queryKey: forgeAPI.key }
  )

  return (
    <Card
      isInteractive
      align="center"
      direction="row"
      gap="md"
      justify="between"
      onClick={() => {
        if (viewOnly) return

        open(ViewTransactionModal, { id: transaction.id })
      }}
    >
      {transaction.type === 'transfer' ? (
        <TransactionTransferItem transaction={transaction} />
      ) : (
        <TransactionIncomeExpensesItem transaction={transaction} />
      )}
      {!viewOnly && (
        <ContextMenu
          componentProps={{
            menu: {
              minWidth: '16em'
            }
          }}
        >
          {transaction.type !== 'transfer' && (
            <ContextMenuItem
              icon="tabler:copy"
              label="Copy"
              onClick={() => {
                navigator.clipboard.writeText(transaction.particulars)
                toast.success(t('toasts.copyParticulars'))
              }}
            />
          )}
          {transaction.type !== 'transfer' && (
            <ContextMenuItem
              icon="tabler:template"
              label="Create Template From"
              onClick={() =>
                open(ModifyTemplatesModal, {
                  type: 'create',
                  initialData: {
                    name: '',
                    type: transaction.type,
                    particulars: transaction.particulars,
                    amount: transaction.amount,
                    asset: transaction.asset,
                    category: transaction.category,
                    ledgers: transaction.ledgers ?? [],
                    location_name: transaction.location_name,
                    location_coords: transaction.location_coords
                  }
                })
              }
            />
          )}
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={() =>
              open(ModifyTransactionsModal, {
                type: 'update',
                initialData: transaction
              })
            }
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={() => {
              open(ConfirmationModal, {
                title: 'Delete Transaction',
                description:
                  'Are you sure you want to delete this transaction?',
                confirmationButton: 'delete',
                onConfirm: async () => {
                  await deleteMutation.mutateAsync(undefined)
                }
              })
            }}
          />
        </ContextMenu>
      )}
    </Card>
  )
}

export default TransactionItem
