import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { useWalletContext } from '@modules/Wallet/providers/WalletProvider'

import useComponentBg from '@hooks/useComponentBg'

import { type IWalletLedger } from '../../../interfaces/wallet_interfaces'

function LedgerItem({
  ledger,
  setSelectedData,
  setModifyModalOpenType,
  setDeleteLedgersConfirmationOpen
}: {
  ledger: IWalletLedger
  setSelectedData: React.Dispatch<React.SetStateAction<IWalletLedger | null>>
  setModifyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setDeleteLedgersConfirmationOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}) {
  const { t } = useTranslation('modules.wallet')
  const { componentBgWithHover } = useComponentBg()
  const navigate = useNavigate()
  const { transactions } = useWalletContext()

  return (
    <button
      className={clsx(
        'flex-between shadow-custom relative flex w-full gap-4 rounded-lg p-4 transition-all',
        componentBgWithHover
      )}
      type="button"
      onClick={() => {
        navigate(`/wallet/transactions?ledger=${ledger.id}`)
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
            {typeof transactions !== 'string' &&
              transactions.filter(
                transaction => transaction.ledger === ledger.id
              ).length}{' '}
            {t('transactionCount')}
          </p>
        </div>
      </div>
      <HamburgerMenu>
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={() => {
            setSelectedData(ledger)
            setModifyModalOpenType('update')
          }}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {
            setSelectedData(ledger)
            setDeleteLedgersConfirmationOpen(true)
          }}
        />
      </HamburgerMenu>
    </button>
  )
}

export default LedgerItem
