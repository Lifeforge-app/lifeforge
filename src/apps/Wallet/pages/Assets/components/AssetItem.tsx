import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useNavigate } from 'react-router'

import { Button, HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'
import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

import { type IWalletAsset } from '../../../interfaces/wallet_interfaces'

function AssetItem({
  asset,
  setSelectedData,
  setModifyModalOpenType,
  setDeleteAssetsConfirmationOpen
}: {
  asset: IWalletAsset
  setSelectedData: React.Dispatch<React.SetStateAction<IWalletAsset | null>>
  setModifyModalOpenType: React.Dispatch<'create' | 'update' | null>
  setDeleteAssetsConfirmationOpen: React.Dispatch<boolean>
}) {
  const { isAmountHidden } = useWalletContext()
  const navigate = useNavigate()

  return (
    <div className="bg-bg-100 shadow-custom dark:bg-bg-900 relative space-y-4 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <span className="bg-bg-200 text-bg-500 dark:bg-bg-800 w-min rounded-md p-2">
          <Icon className="size-5" icon={asset.icon} />
        </span>
        <h2 className="text-xl font-medium">{asset.name}</h2>
      </div>
      <p
        className={clsx(
          'flex text-5xl font-medium',
          isAmountHidden ? 'items-center' : 'items-end'
        )}
      >
        <span className="text-bg-500 mr-2 text-3xl">RM</span>
        {isAmountHidden ? (
          <span className="flex items-center">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Icon key={i} className="size-8" icon="uil:asterisk" />
              ))}
          </span>
        ) : (
          numberToCurrency(asset.balance)
        )}
      </p>
      <Button
        className="mt-2 w-full"
        icon="tabler:eye"
        namespace="apps.wallet"
        variant="secondary"
        onClick={() => {
          navigate(`/wallet/transactions?asset=${asset.id}`)
        }}
      >
        View Transactions
      </Button>
      <HamburgerMenu
        classNames={{
          wrapper: 'absolute right-4 top-4'
        }}
      >
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={() => {
            setSelectedData(asset)
            setModifyModalOpenType('update')
          }}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {
            setSelectedData(asset)
            setDeleteAssetsConfirmationOpen(true)
          }}
        />
      </HamburgerMenu>
    </div>
  )
}

export default AssetItem
