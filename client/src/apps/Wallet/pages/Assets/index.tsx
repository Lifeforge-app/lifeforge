import { useQueryClient } from '@tanstack/react-query'
import {
  Button,
  ContextMenuItem,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

import AssetItem from './components/AssetItem'
import ModifyAssetModal from './modals/ModifyAssetModal'

function Assets() {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.wallet')

  const { assetsQuery } = useWalletData()

  const { isAmountHidden, toggleAmountVisibility } = useWalletStore()

  const { hash } = useLocation()

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
    <ModuleWrapper>
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
                text="Refresh"
                onClick={() => {
                  queryClient.invalidateQueries({
                    queryKey: ['wallet', 'assets']
                  })
                  assetsQuery.refetch()
                }}
              />
              <ContextMenuItem
                icon="tabler:eye-off"
                isToggled={isAmountHidden}
                namespace="apps.wallet"
                text="Hide Amount"
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
      <QueryWrapper query={assetsQuery}>
        {assets => (
          <>
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
      </QueryWrapper>
    </ModuleWrapper>
  )
}

export default Assets
