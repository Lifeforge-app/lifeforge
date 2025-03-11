import { useWalletContext } from '@providers/WalletProvider'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import {
  APIFallbackComponent,
  Button,
  DeleteConfirmationModal,
  EmptyStateScreen,
  FAB,
  MenuItem
} from '@lifeforge/ui'

import { type IWalletAsset } from '@interfaces/wallet_interfaces'

import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'

import AssetItem from './components/AssetItem'
import ModifyAssetsModal from './components/ModifyAssetsModal'

function Assets(): React.ReactElement {
  const { t } = useTranslation('modules.wallet')
  const { assets, refreshAssets, isAmountHidden, toggleAmountVisibility } =
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
          typeof assets !== 'string' &&
          assets.length > 0 && (
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
        title="Assets"
      />
      <APIFallbackComponent data={assets}>
        {assets =>
          assets.length > 0 ? (
            <div className="mb-24 mt-6 grid grid-cols-1 gap-4 md:mb-6 md:grid-cols-2 lg:grid-cols-3">
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
              namespace="modules.wallet"
              onCTAClick={setModifyModalOpenType}
            />
          )
        }
      </APIFallbackComponent>
      {assets.length > 0 && (
        <FAB
          icon="tabler:plus"
          onClick={() => {
            setSelectedData(null)
            setModifyModalOpenType('create')
          }}
        />
      )}
      <ModifyAssetsModal
        existedData={selectedData}
        openType={modifyAssetsModalOpenType}
        refreshAssets={refreshAssets}
        setExistedData={setSelectedData}
        setOpenType={setModifyModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/assets"
        data={selectedData}
        isOpen={deleteAssetsConfirmationOpen}
        itemName="asset account"
        nameKey="name"
        updateDataList={refreshAssets}
        onClose={() => {
          setDeleteAssetsConfirmationOpen(false)
          setSelectedData(null)
        }}
      />
    </ModuleWrapper>
  )
}

export default Assets
