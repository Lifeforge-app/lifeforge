import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IWalletAssetEntry } from '@typedec/Wallet'
import ModifyAssetsModal from './components/ModifyAssetsModal'

function Assets(): React.ReactElement {
  const [assets, refreshAssets] =
    useFetch<IWalletAssetEntry[]>('wallet/assets/list')
  const [modifyAssetsModalOpenType, setModifyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteAssetsConfirmationOpen, setDeleteAssetsConfirmationOpen] =
    useState(false)
  const [selectedData, setSelectedData] = useState<IWalletAssetEntry | null>(
    null
  )

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Assets"
        desc="Manage your assets here."
        actionButton={
          typeof assets !== 'string' &&
          assets.length > 0 && (
            <Button
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
        {typeof assets !== 'string' && assets.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assets.map(asset => (
              <div
                key={asset.id}
                className="relative flex flex-col gap-4 rounded-lg bg-bg-100 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900"
              >
                <div className="flex items-center gap-3">
                  <span className="w-min rounded-md bg-bg-800 p-2">
                    <Icon icon={asset.icon} className="h-6 w-6" />
                  </span>
                  <h2 className="text-2xl font-medium">{asset.name}</h2>
                </div>
                <p className="text-5xl font-medium">
                  <span className="mr-2 text-3xl text-bg-500">RM</span>
                  {(+asset.balance).toFixed(2)}
                </p>
                <Button icon="tabler:eye" className="mt-2">
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
        )}
      </APIComponentWithFallback>
      <ModifyAssetsModal
        existedData={selectedData}
        setExistedData={setSelectedData}
        openType={modifyAssetsModalOpenType}
        setOpenType={setModifyModalOpenType}
        refreshAssets={refreshAssets}
      />
      <DeleteConfirmationModal
        apiEndpoint="wallet/assets/delete"
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
