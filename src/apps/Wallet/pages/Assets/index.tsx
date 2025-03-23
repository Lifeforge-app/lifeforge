import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import {
  Button,
  DeleteConfirmationModal,
  EmptyStateScreen,
  FAB,
  MenuItem,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from '@lifeforge/ui'

import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

import { type IWalletAsset } from '../../interfaces/wallet_interfaces'
import AssetItem from './components/AssetItem'
import ModifyAssetsModal from './components/ModifyAssetsModal'

function Assets() {
  const { t } = useTranslation('apps.wallet')
  const { assetsQuery, isAmountHidden, toggleAmountVisibility } =
    useWalletContext()
  const [modifyAssetsModalOpenType, setModifyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteAssetsConfirmationOpen, setDeleteAssetsConfirmationOpen] =
    useState(false)
  const [selectedData, setSelectedData] = useState<IWalletAsset | null>(null)
  const { hash } = useLocation()

  useEffect(() => {
    if (hash === '#new') {
      setSelectedData(null)
      setModifyModalOpenType('create')
    }
  }, [hash])

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          (assetsQuery.data ?? []).length > 0 && (
            <Button
              className="hidden sm:flex"
              icon="tabler:plus"
              tProps={{
                item: t('items.asset')
              }}
              onClick={() => {
                setModifyModalOpenType('create')
              }}
            >
              new
            </Button>
          )
        }
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:eye-off"
              isToggled={isAmountHidden}
              text="Hide Amount"
              onClick={() => {
                toggleAmountVisibility(!isAmountHidden)
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
              <div className="mt-6 mb-24 grid grid-cols-1 gap-4 md:mb-6 md:grid-cols-2 lg:grid-cols-3">
                {assets.map(asset => (
                  <AssetItem
                    key={asset.id}
                    asset={asset}
                    setDeleteAssetsConfirmationOpen={
                      setDeleteAssetsConfirmationOpen
                    }
                    setModifyModalOpenType={setModifyModalOpenType}
                    setSelectedData={setSelectedData}
                  />
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
                onCTAClick={setModifyModalOpenType}
              />
            )}
            {assets.length > 0 && (
              <FAB
                icon="tabler:plus"
                onClick={() => {
                  setSelectedData(null)
                  setModifyModalOpenType('create')
                }}
              />
            )}
          </>
        )}
      </QueryWrapper>
      <ModifyAssetsModal
        existedData={selectedData}
        openType={modifyAssetsModalOpenType}
        setExistedData={setSelectedData}
        setOpenType={setModifyModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/assets"
        confirmationText="Delete this asset account"
        data={selectedData ?? undefined}
        isOpen={deleteAssetsConfirmationOpen}
        itemName="asset account"
        nameKey="name"
        queryKey={['wallet', 'assets']}
        onClose={() => {
          setDeleteAssetsConfirmationOpen(false)
          setSelectedData(null)
        }}
      />
    </ModuleWrapper>
  )
}

export default Assets
