import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useNavigate } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import { type IWalletAsset } from '@interfaces/wallet_interfaces'
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
  const navigate = useNavigate()

  return (
    <div className="relative space-y-4 rounded-lg bg-bg-100 p-4 shadow-custom dark:bg-bg-900">
      <div className="flex items-center gap-3">
        <span className="w-min rounded-md bg-bg-200 p-2 text-bg-500 dark:bg-bg-800">
          <Icon icon={asset.icon} className="size-5" />
        </span>
        <h2 className="text-xl font-medium">{asset.name}</h2>
      </div>
      <p className="text-5xl font-medium">
        <span className="mr-2 text-3xl text-bg-500">RM</span>
        {numberToMoney(asset.balance)}
      </p>
      <Button
        variant="secondary"
        onClick={() => {
          navigate(`/wallet/transactions?asset=${asset.id}`)
        }}
        icon="tabler:eye"
        className="mt-2 w-full"
      >
        View Transactions
      </Button>
      <HamburgerMenu className="absolute right-4 top-0">
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={() => {
            setSelectedData(asset)
            setModifyModalOpenType('update')
          }}
        />
        <MenuItem
          icon="tabler:trash"
          text="Delete"
          isRed
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
