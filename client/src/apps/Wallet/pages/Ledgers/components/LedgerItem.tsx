import { Icon } from '@iconify/react'
import { DeleteConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import {
  ISchemaWithPB,
  WalletCollectionsSchemas
} from 'shared/types/collections'

import ModifyLedgerModal from '../modals/ModifyLedgerModal'

function LedgerItem({
  ledger
}: {
  ledger: ISchemaWithPB<WalletCollectionsSchemas.ILedgerAggregated>
}) {
  const { t } = useTranslation('apps.wallet')

  const navigate = useNavigate()

  const open = useModalStore(state => state.open)

  return (
    <div
      aria-label={`View ${ledger.name} transactions`}
      className="flex-between shadow-custom component-bg-with-hover relative flex w-full cursor-pointer gap-3 rounded-lg p-4 transition-all"
      role="button"
      tabIndex={0}
      onClick={() => {
        navigate(`/wallet/transactions?ledger=${ledger.id}`)
      }}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(`/wallet/transactions?ledger=${ledger.id}`)
        }
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-min rounded-md p-2"
          style={{
            backgroundColor: ledger.color + '20'
          }}
        >
          <Icon
            className="size-8"
            icon={ledger.icon}
            style={{
              color: ledger.color
            }}
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
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={() => {
            open(ModifyLedgerModal, {
              type: 'update',
              existedData: ledger
            })
          }}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {
            open(DeleteConfirmationModal, {
              apiEndpoint: 'wallet/ledgers',
              confirmationText: 'Delete this ledger',
              data: ledger,
              itemName: 'ledger',
              nameKey: 'name' as const,
              queryKey: ['wallet', 'ledgers']
            })
          }}
        />
      </HamburgerMenu>
    </div>
  )
}

export default LedgerItem
