import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  ConfirmationModal,
  HamburgerMenu,
  MenuItem,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import type { WalletLedger } from '@apps/Wallet/hooks/useWalletData'

import ModifyLedgerModal from '../modals/ModifyLedgerModal'

function LedgerItem({ ledger }: { ledger: WalletLedger }) {
  const { t } = useTranslation('apps.wallet')

  const navigate = useNavigate()

  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const deleteMutation = useMutation(
    forgeAPI.wallet.ledgers.remove.input({ id: ledger.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['wallet', 'ledgers'] })
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
      buttonType: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })

  return (
    <div
      aria-label={`View ${ledger.name} transactions`}
      className="flex-between shadow-custom component-bg-with-hover relative flex w-full cursor-pointer gap-3 rounded-lg p-4 transition-all"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/wallet/transactions?ledger=${ledger.id}`)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(`/wallet/transactions?ledger=${ledger.id}`)
        }
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-min rounded-md p-2"
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
      <HamburgerMenu>
        <MenuItem icon="tabler:pencil" text="Edit" onClick={handleEditLedger} />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={handleDeleteLedger}
        />
      </HamburgerMenu>
    </div>
  )
}

export default LedgerItem
