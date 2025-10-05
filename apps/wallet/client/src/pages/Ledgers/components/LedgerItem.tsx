import type { WalletLedger } from '@/hooks/useWalletData'
import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  ItemWrapper,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import ModifyLedgerModal from '../modals/ModifyLedgerModal'

function LedgerItem({ ledger }: { ledger: WalletLedger }) {
  const { t } = useTranslation('apps.wallet')

  const navigate = useNavigate()

  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const deleteMutation = useMutation(
    forgeAPI.wallet.ledgers.remove.input({ id: ledger.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['wallet', 'ledgers']
        })
      },
      onError: (error: Error) => {
        toast.error('Failed to delete ledger: ' + error.message)
      }
    })
  )

  const handleEditLedger = () =>
    open(ModifyLedgerModal, {
      type: 'update',
      initialData: ledger
    })

  const handleDeleteLedger = () =>
    open(ConfirmationModal, {
      title: 'Delete Ledger',
      description: `Are you sure you want to delete the ledger "${ledger.name}"? This action cannot be undone.`,
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })

  return (
    <ItemWrapper
      isInteractive
      className="flex-between gap-3"
      onClick={() => navigate(`/wallet/transactions?ledger=${ledger.id}`)}
    >
      <div className="flex items-center gap-3">
        <span
          className="shadow-custom w-min rounded-md p-2"
          style={{ backgroundColor: ledger.color + '20' }}
        >
          <Icon
            className="size-8"
            icon={ledger.icon}
            style={{ color: ledger.color }}
          />
        </span>
        <div>
          <h2 className="text-xl font-medium">{ledger.name}</h2>
          <p className="text-bg-500 text-left text-sm">
            {ledger.amount} {t('transactionCount')}
          </p>
        </div>
      </div>
      <ContextMenu>
        <ContextMenuItem
          icon="tabler:pencil"
          label="Edit"
          onClick={handleEditLedger}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={handleDeleteLedger}
        />
      </ContextMenu>
    </ItemWrapper>
  )
}

export default LedgerItem
