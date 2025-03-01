import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { type IWalletAsset } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import { numberToMoney } from '@utils/strings'

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
}): React.ReactElement {
  const { isAmountHidden } = useWalletContext()
  const navigate = useNavigate()

  return (
    <div className="relative space-y-4 rounded-lg bg-bg-100 p-4 shadow-custom dark:bg-bg-900">
      <div className="flex items-center gap-3">
        <span className="w-min rounded-md bg-bg-200 p-2 text-bg-500 dark:bg-bg-800">
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
        <span className="mr-2 text-3xl text-bg-500">RM</span>
        {isAmountHidden ? (
          <span className="flex items-center">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Icon key={i} className="size-8" icon="uil:asterisk" />
              ))}
          </span>
        ) : (
          numberToMoney(asset.balance)
        )}
      </p>
      <Button
        className="mt-2 w-full"
        icon="tabler:eye"
        namespace="modules.wallet"
        variant="secondary"
        onClick={() => {
          navigate(`/wallet/transactions?asset=${asset.id}`)
        }}
      >
        View Transactions
      </Button>
      <HamburgerMenu className="absolute right-4 top-4">
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
