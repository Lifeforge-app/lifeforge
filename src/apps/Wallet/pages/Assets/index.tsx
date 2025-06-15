import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import {
  Button,
  EmptyStateScreen,
  FAB,
  MenuItem,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from '@lifeforge/ui'
import { useModalsEffect } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

import AssetItem from './components/AssetItem'
import { walletAssetsModals } from './modals'

function Assets() {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('apps.wallet')
  const { assetsQuery } = useWalletData()
  const { isAmountHidden, toggleAmountVisibility } = useWalletStore()
  const { hash } = useLocation()

  const handleCreateCategory = useCallback(() => {
    open('wallet.assets.modifyAsset', {
      type: 'create',
      existedData: null
    })
  }, [])

  useEffect(() => {
    if (hash === '#new') {
      handleCreateCategory()
    }
  }, [hash])

  useModalsEffect(walletAssetsModals)

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
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:refresh"
              text="Refresh"
              onClick={() => {
                assetsQuery.refetch()
              }}
            />
            <MenuItem
              icon="tabler:eye-off"
              isToggled={isAmountHidden}
              namespace="apps.wallet"
              text="Hide Amount"
              onClick={() => {
                toggleAmountVisibility()
              }}
            />
          </>
        }
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
                ctaContent="new"
                ctaTProps={{
                  item: t('items.asset')
                }}
                icon="tabler:wallet-off"
                name="assets"
                namespace="apps.wallet"
                onCTAClick={handleCreateCategory}
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
