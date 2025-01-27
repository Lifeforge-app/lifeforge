import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Scrollbar from '@components/utilities/Scrollbar'
import Tabs from '@components/utilities/Tabs'
import useFetch from '@hooks/useFetch'
import {
  type IWishlistEntry,
  type IWishlistList
} from '@interfaces/wishlist_interfaces'
import EntryItem from './components/EntryItem'
import FromOtherAppsModal from './components/FromOtherAppsModal'
import Header from './components/Header'
import ModifyEntryModal from './components/ModifyEntryModal'

function WishlistEntries(): React.ReactElement {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [lists] = useFetch<IWishlistList[]>('wishlist/lists')
  const [valid] = useFetch<boolean>(`wishlist/lists/valid/${id}`)
  const [activeTab, setActiveTab] = useState('wishlist')
  const [wishlistListDetails] = useFetch<IWishlistList>(
    `wishlist/lists/${id}`,
    valid === true
  )
  const [entries, , setEntries] = useFetch<IWishlistEntry[]>(
    `wishlist/entries/${id}?bought=${activeTab === 'bought'}`,
    valid === true
  )
  const [collectionId] = useFetch<string>(
    'wishlist/entries/collection-id',
    valid === true
  )
  const [isFromOtherAppsModalOpen, setFromOtherAppsModalOpen] = useState(false)
  const [existedData, setExistedData] =
    useState<Partial<IWishlistEntry> | null>(null)
  const [modifyEntryModalOpenType, setModifyEntryModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [
    deleteEntryConfirmationModalOpen,
    setDeleteEntryConfirmationModalOpen
  ] = useState(false)

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      toast.error('Invalid ID')
      navigate('/wishlist')
    }
  }, [valid])

  const handleEdit = (entry: IWishlistEntry) => {
    setExistedData(entry)
    setModifyEntryModalOpenType('update')
  }

  const handleDelete = (entry: IWishlistEntry) => {
    setExistedData(entry)
    setDeleteEntryConfirmationModalOpen(true)
  }

  return (
    <ModuleWrapper>
      <Header
        wishlistListDetails={wishlistListDetails}
        setModifyEntryModalOpenType={setModifyEntryModalOpenType}
        setExistedData={setExistedData}
        setFromOtherAppsModalOpen={setFromOtherAppsModalOpen}
      />
      <Tabs
        items={[
          {
            id: 'wishlist',
            name: 'Wishlist',
            icon: 'tabler:heart',
            amount: (() => {
              if (
                typeof entries === 'string' ||
                typeof wishlistListDetails === 'string'
              ) {
                return 0
              }

              return activeTab === 'wishlist'
                ? entries.length
                : wishlistListDetails.item_count - entries.length
            })()
          },
          {
            id: 'bought',
            name: 'Bought',
            icon: 'tabler:check',
            amount: (() => {
              if (
                typeof entries === 'string' ||
                typeof wishlistListDetails === 'string'
              ) {
                return 0
              }

              return activeTab === 'bought'
                ? entries.length
                : wishlistListDetails.item_count - entries.length
            })()
          }
        ]}
        active={activeTab}
        enabled={['wishlist', 'bought']}
        onNavClick={setActiveTab}
        className="mt-6"
      />
      <APIFallbackComponent data={collectionId}>
        {collectionId => (
          <APIFallbackComponent data={entries}>
            {entries => {
              if (entries.length === 0) {
                return (
                  <EmptyStateScreen
                    title="No entries"
                    description="Add items to your wishlist"
                    icon="tabler:shopping-cart-off"
                    ctaContent="New Item"
                  />
                )
              }

              return (
                <Scrollbar>
                  <ul className="mb-14 flex flex-col space-y-2 sm:mb-6">
                    {entries.map(entry => (
                      <EntryItem
                        key={entry.id}
                        entry={entry}
                        collectionId={collectionId}
                        setEntries={setEntries}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </ul>
                </Scrollbar>
              )
            }}
          </APIFallbackComponent>
        )}
      </APIFallbackComponent>
      <FromOtherAppsModal
        isOpen={isFromOtherAppsModalOpen}
        onClose={() => {
          setFromOtherAppsModalOpen(false)
        }}
        setExistedData={setExistedData}
        setModifyEntryModalOpenType={setModifyEntryModalOpenType}
      />
      <DeleteConfirmationModal
        isOpen={deleteEntryConfirmationModalOpen}
        onClose={() => {
          setDeleteEntryConfirmationModalOpen(false)
        }}
        apiEndpoint="wishlist/entries"
        data={existedData}
        itemName="entry"
        nameKey="name"
        updateDataLists={() => {
          setEntries(prev => {
            if (typeof prev === 'string') {
              return prev
            }
            return prev.filter(e => e.id !== existedData?.id)
          })
        }}
      />
      <ModifyEntryModal
        openType={modifyEntryModalOpenType}
        existedData={existedData}
        setEntries={setEntries}
        setOpenType={setModifyEntryModalOpenType}
        collectionId={collectionId}
        lists={lists}
      />
      <Menu as="div" className="absolute bottom-6 right-6 z-50 block md:hidden">
        <Button onClick={() => {}} icon="tabler:plus" as={MenuButton} />
        <MenuItems
          transition
          anchor="top end"
          className="overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none transition duration-100 ease-out [--anchor-gap:8px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
        >
          <MenuItem onClick={() => {}} icon="tabler:plus" text="Add Manually" />
          <MenuItem
            onClick={() => {
              setFromOtherAppsModalOpen(true)
            }}
            icon="tabler:apps"
            text="From Other Apps"
          />
        </MenuItems>
      </Menu>
    </ModuleWrapper>
  )
}

export default WishlistEntries
