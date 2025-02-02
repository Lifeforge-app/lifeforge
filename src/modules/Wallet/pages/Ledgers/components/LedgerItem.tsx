import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
import { type IWalletLedger } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'

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
}): React.ReactElement {
  const { t } = useTranslation('modules.wallet')
  const { componentBgWithHover } = useThemeColors()
  const navigate = useNavigate()
  const { transactions } = useWalletContext()

  return (
    <button
      className={`flex-between relative flex w-full gap-4 rounded-lg p-4 shadow-custom transition-all ${componentBgWithHover}`}
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
          <p className="text-left text-sm text-bg-500">
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
