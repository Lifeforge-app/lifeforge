import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  APIFallbackComponent,
  Button,
  DeleteConfirmationModal,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper
} from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

import ModifyWishlistListModal from './components/ModifyWishlistModal'
import WishlistListItem from './components/WishlistListItem'
import { type IWishlistList } from './interfaces/wishlist_interfaces'

function Wishlist(): React.ReactElement {
  const { t } = useTranslation('modules.wishlist')
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
        actionButton={
          <Button
            className="hidden md:flex"
            icon="tabler:plus"
            tProps={{ item: t('items.wishlist') }}
            onClick={() => {
              setModifyWishlistListModalOpenType('create')
            }}
          >
            New
          </Button>
        }
        icon="tabler:heart"
        title="Wishlist"
      />
      <APIFallbackComponent data={lists}>
        {lists =>
          lists.length ? (
            <div className="mb-14 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(24rem,1fr))]">
              {lists.map(list => (
                <WishlistListItem
                  key={list.id}
                  list={list}
                  onDelete={() => {
                    setExistedData(list)
                    setDeleteConfirmationModalOpen(true)
                  }}
                  onEdit={() => {
                    setExistedData(list)
                    setModifyWishlistListModalOpenType('update')
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyStateScreen
              icon="tabler:box-off"
              name="wishlists"
              namespace="modules.wishlist"
            />
          )
        }
      </APIFallbackComponent>
      <ModifyWishlistListModal
        existedData={existedData}
        openType={modifyWishlistListModalOpenType}
        setOpenType={setModifyWishlistListModalOpenType}
        updateWishlistList={refreshLists}
      />
      <DeleteConfirmationModal
        apiEndpoint="wishlist/lists"
        data={existedData}
        isOpen={deleteConfirmationModalOpen}
        itemName="wishlist"
        nameKey="name"
        updateDataList={() => {
          setLists(prev => {
            if (typeof prev === 'string') return prev
            return prev.filter(list => list.id !== existedData?.id)
          })
        }}
        onClose={() => {
          setDeleteConfirmationModalOpen(false)
        }}
      />
      <FAB
        hideWhen="md"
        icon="tabler:plus"
        onClick={() => {
          setModifyWishlistListModalOpenType('create')
        }}
      />
    </ModuleWrapper>
  )
}

export default Wishlist
