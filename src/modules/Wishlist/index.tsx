import React, { useState } from 'react'
import { Button , FAB } from '@components/buttons'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { type IWishlistList } from '@interfaces/wishlist_interfaces'
import ModifyWishlistListModal from './components/ModifyWishlistModal'
import WishlistListItem from './components/WishlistListItem'

function Wishlist(): React.ReactElement {
  const [lists, refreshLists, setLists] =
    useFetch<IWishlistList[]>('wishlist/lists')
  const [existedData, setExistedData] = useState<IWishlistList | null>(null)
  const [modifyWishlistListModalOpenType, setModifyWishlistListModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false)

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Wishlist"
        icon="tabler:heart"
        actionButton={
          <Button
            className="hidden md:flex"
            icon="tabler:plus"
            onClick={() => {
              setModifyWishlistListModalOpenType('create')
            }}
          >
            New Wishlist
          </Button>
        }
      />
      <APIFallbackComponent data={lists}>
        {lists => {
          return (
            <div className="mb-14 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(24rem,1fr))]">
              {lists.map(list => (
                <WishlistListItem
                  key={list.id}
                  list={list}
                  onEdit={() => {
                    setExistedData(list)
                    setModifyWishlistListModalOpenType('update')
                  }}
                  onDelete={() => {
                    setExistedData(list)
                    setDeleteConfirmationModalOpen(true)
                  }}
                />
              ))}
            </div>
          )
        }}
      </APIFallbackComponent>
      <ModifyWishlistListModal
        openType={modifyWishlistListModalOpenType}
        setOpenType={setModifyWishlistListModalOpenType}
        updateWishlistList={refreshLists}
        existedData={existedData}
      />
      <DeleteConfirmationModal
        isOpen={deleteConfirmationModalOpen}
        onClose={() => {
          setDeleteConfirmationModalOpen(false)
        }}
        apiEndpoint="wishlist/lists"
        data={existedData}
        itemName="wishlist"
        nameKey="name"
        updateDataLists={() => {
          setLists(prev => {
            if (typeof prev === 'string') return prev
            return prev.filter(list => list.id !== existedData?.id)
          })
        }}
      />
      <FAB
        icon="tabler:plus"
        onClick={() => {
          setModifyWishlistListModalOpenType('create')
        }}
        hideWhen="md"
      />
    </ModuleWrapper>
  )
}

export default Wishlist
