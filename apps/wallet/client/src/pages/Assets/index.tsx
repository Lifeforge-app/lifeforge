import { useWalletData } from '@/hooks/useWalletData'
import { useWalletStore } from '@/stores/useWalletStore'
import { useQueryClient } from '@tanstack/react-query'
import {
  Button,
  ContextMenuItem,
  DashboardItem,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  WithQuery
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import TotalBalance from './components/Amount'
import AssetItem from './components/AssetItem'
import ModifyAssetModal from './modals/ModifyAssetModal'

function Assets() {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.wallet')

  const { assetsQuery } = useWalletData()

  const { isAmountHidden, toggleAmountVisibility } = useWalletStore()

  const { hash } = useLocation()

  const totalBalance = useMemo(() => {
    return (assetsQuery.data ?? []).reduce(
      (sum, asset) => sum + asset.current_balance,
      0
    )
  }, [assetsQuery.data])

  const handleCreateCategory = useCallback(() => {
    open(ModifyAssetModal, {
      type: 'create'
    })
  }, [])

  useEffect(() => {
    if (hash === '#new') {
      handleCreateCategory()
    }
  }, [hash])

  return (
    <>
      <ModuleHeader
        actionButton={
          <>
            {(assetsQuery.data ?? []).length > 0 && (
              <Button
                className="hidden sm:flex"
                icon="tabler:plus"
                tProps={{
                  item: t('items.asset')
                }}
                onClick={handleCreateCategory}
              >
                new
              </Button>
            )}
          </>
        }
        contextMenuProps={{
          children: (
            <>
              <ContextMenuItem
                icon="tabler:refresh"
                label="Refresh"
                onClick={() => {
                  queryClient.invalidateQueries({
                    queryKey: ['wallet', 'assets']
                  })
                  assetsQuery.refetch()
                }}
              />
              <ContextMenuItem
                checked={isAmountHidden}
                icon="tabler:eye-off"
                label="Hide Amount"
                namespace="apps.wallet"
                onClick={() => {
                  toggleAmountVisibility()
                }}
              />
            </>
          )
        }}
        icon="tabler:wallet"
        namespace="apps.wallet"
        title="Assets"
        tKey="subsectionsTitleAndDesc"
      />
      <WithQuery query={assetsQuery}>
        {assets => (
          <>
            <DashboardItem
              className="mb-6 h-min"
              componentBesideTitle={
                <TotalBalance
                  amount={totalBalance}
                  className="hidden sm:flex"
                />
              }
              icon="tabler:currency-dollar"
              namespace="apps.wallet"
              title="Total Assets"
            >
              <TotalBalance
                amount={totalBalance}
                className="flex-center w-full sm:hidden"
              />
            </DashboardItem>
            {assets.length > 0 ? (
              <div className="mb-24 grid grid-cols-1 gap-3 md:mb-6 md:grid-cols-2 lg:grid-cols-3">
                {assets.map(asset => (
                  <AssetItem key={asset.id} asset={asset} />
                ))}
              </div>
            ) : (
              <EmptyStateScreen
                CTAButtonProps={{
                  children: 'new',
                  icon: 'tabler:plus',
                  onClick: handleCreateCategory
                }}
                icon="tabler:wallet-off"
                name="assets"
                namespace="apps.wallet"
              />
            )}
            {assets.length > 0 && (
              <FAB icon="tabler:plus" onClick={handleCreateCategory} />
            )}
          </>
        )}
      </WithQuery>
    </>
  )
}

export default Assets
