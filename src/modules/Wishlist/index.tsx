import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  DeleteConfirmationModal,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import ModifyWishlistListModal from './components/ModifyWishlistModal'
import WishlistListItem from './components/WishlistListItem'
import { type IWishlistList } from './interfaces/wishlist_interfaces'

function Wishlist() {
  const { t } = useTranslation('modules.wishlist')
  const listsQuery = useAPIQuery<IWishlistList[]>('wishlist/lists', [
    'wishlist',
    'lists'
  ])
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
      <QueryWrapper query={listsQuery}>
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
      </QueryWrapper>
      <ModifyWishlistListModal
        existedData={existedData}
        openType={modifyWishlistListModalOpenType}
        setOpenType={setModifyWishlistListModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="wishlist/lists"
        data={existedData}
        isOpen={deleteConfirmationModalOpen}
        itemName="wishlist"
        nameKey="name"
        queryKey={['wishlist', 'lists']}
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
