import { Icon } from '@iconify/react'
import clsx from 'clsx'
import {
  Button,
  DeleteConfirmationModal,
  HamburgerMenu,
  MenuItem
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'
import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

import { type IWalletAsset } from '../../../interfaces/wallet_interfaces'
import BalanceChartModal from '../modals/BalanceChartModal'
import ModifyAssetModal from '../modals/ModifyAssetModal'

function AssetItem({ asset }: { asset: IWalletAsset }) {
  const open = useModalStore(state => state.open)
  const { isAmountHidden } = useWalletStore()
  const navigate = useNavigate()

  const handleEditAsset = useCallback(() => {
    open(ModifyAssetModal, {
      type: 'update',
      existedData: asset
    })
  }, [asset])

  const handleOpenBalanceChart = useCallback(() => {
    open(BalanceChartModal, {
      existedData: asset
    })
  }, [asset])

  const handleDeleteAsset = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'wallet/assets',
      confirmationText: 'Delete this asset account',
      data: asset,
      itemName: 'asset account',
      nameKey: 'name',
      queryKey: ['wallet', 'assets']
    })
  }, [asset])

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
        className="mt-4 w-full"
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
          icon="tabler:chart-line"
          namespace="apps.wallet"
          text="View Balance Chart"
          onClick={handleOpenBalanceChart}
        />
        <MenuItem icon="tabler:pencil" text="Edit" onClick={handleEditAsset} />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={handleDeleteAsset}
        />
      </HamburgerMenu>
    </div>
  )
}

export default AssetItem
