import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import {
  Button,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  ItemWrapper,
  useModalStore
} from 'lifeforge-ui'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import type { WalletAsset } from '@apps/03.Finance/wallet/hooks/useWalletData'
import { useWalletStore } from '@apps/03.Finance/wallet/stores/useWalletStore'
import numberToCurrency from '@apps/03.Finance/wallet/utils/numberToCurrency'

import BalanceChartModal from '../modals/BalanceChartModal'
import ModifyAssetModal from '../modals/ModifyAssetModal'

function AssetItem({ asset }: { asset: WalletAsset }) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const { isAmountHidden } = useWalletStore()

  const navigate = useNavigate()

  const deleteMutation = useMutation(
    forgeAPI.wallet.assets.remove
      .input({
        id: asset.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['wallet', 'assets'] })
        },
        onError: (error: Error) => {
          toast.error('Failed to delete asset: ' + error.message)
        }
      })
  )

  const handleEditAsset = () =>
    open(ModifyAssetModal, {
      type: 'update',
      initialData: asset
    })

  const handleOpenBalanceChart = () =>
    open(BalanceChartModal, {
      initialData: asset
    })

  const handleDeleteAsset = () =>
    open(ConfirmationModal, {
      title: 'Delete Asset',
      description: `Are you sure you want to delete the asset "${asset.name}"? This action cannot be undone.`,
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })

  return (
    <ItemWrapper className="space-y-3">
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
          <span className="truncate">
            {numberToCurrency(asset.current_balance)}
          </span>
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
      <ContextMenu
        classNames={{
          wrapper: 'absolute right-4 top-4'
        }}
      >
        <ContextMenuItem
          icon="tabler:chart-line"
          label="View Balance Chart"
          namespace="apps.wallet"
          onClick={handleOpenBalanceChart}
        />
        <ContextMenuItem
          icon="tabler:pencil"
          label="Edit"
          onClick={handleEditAsset}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={handleDeleteAsset}
        />
      </ContextMenu>
    </ItemWrapper>
  )
}

export default AssetItem
