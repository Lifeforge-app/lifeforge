import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import FAB from '@components/ButtonsAndInputs/FAB'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { type IWalletAssetEntry } from '@interfaces/wallet_interfaces'
import { useWalletContext } from '@providers/WalletProvider'
import AssetItem from './components/AssetItem'
import ModifyAssetsModal from './components/ModifyAssetsModal'

function Assets(): React.ReactElement {
  const { assets, refreshAssets } = useWalletContext()
  const [modifyAssetsModalOpenType, setModifyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteAssetsConfirmationOpen, setDeleteAssetsConfirmationOpen] =
    useState(false)
  const [selectedData, setSelectedData] = useState<IWalletAssetEntry | null>(
    null
  )
  const { hash } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (hash === '#new') {
      setSelectedData(null)
      setModifyModalOpenType('create')
      navigate('/wallet/assets')
    }
  }, [hash])

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Assets"
        desc="Manage your assets here."
        actionButton={
          typeof assets !== 'string' &&
          assets.length > 0 && (
            <Button
              className="hidden sm:flex"
              onClick={() => {
                setModifyModalOpenType('create')
              }}
              icon="tabler:plus"
            >
              Add Asset
            </Button>
          )
        }
      />
      <APIComponentWithFallback data={assets}>
        {assets =>
          assets.length > 0 ? (
            <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assets.map(asset => (
                <AssetItem
                  key={asset.id}
                  asset={asset}
                  setSelectedData={setSelectedData}
                  setModifyModalOpenType={setModifyModalOpenType}
                  setDeleteAssetsConfirmationOpen={
                    setDeleteAssetsConfirmationOpen
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyStateScreen
              title="Oops! No assets found."
              description="You don't have any assets yet. Add some to get started."
              ctaContent="Add Asset"
              setModifyModalOpenType={setModifyModalOpenType}
              icon="tabler:wallet-off"
            />
          )
        }
      </APIComponentWithFallback>
      {assets.length > 0 && (
        <FAB
          onClick={() => {
            setSelectedData(null)
            setModifyModalOpenType('create')
          }}
          icon="tabler:plus"
        />
      )}
      <ModifyAssetsModal
        existedData={selectedData}
        setExistedData={setSelectedData}
        openType={modifyAssetsModalOpenType}
        setOpenType={setModifyModalOpenType}
        refreshAssets={refreshAssets}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/assets"
        isOpen={deleteAssetsConfirmationOpen}
        data={selectedData}
        itemName="asset account"
        onClose={() => {
          setDeleteAssetsConfirmationOpen(false)
          setSelectedData(null)
        }}
        updateDataList={refreshAssets}
        nameKey="name"
      />
    </ModuleWrapper>
  )
}

export default Assets
