import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

import {
  APIFallbackComponent,
  Button,
  DeleteConfirmationModal,
  EmptyStateScreen,
  MenuItem,
  ModuleWrapper,
  Scrollbar,
  Tabs
} from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

import {
  IWishlistEntry,
  IWishlistList
} from '../../interfaces/wishlist_interfaces'
import EntryItem from './components/EntryItem'
import FromOtherAppsModal from './components/FromOtherAppsModal'
import Header from './components/Header'
import ModifyEntryModal from './components/ModifyEntryModal'

function WishlistEntries() {
  const { t } = useTranslation('modules.wishlist')
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
        setExistedData={setExistedData}
        setFromOtherAppsModalOpen={setFromOtherAppsModalOpen}
        setModifyEntryModalOpenType={setModifyEntryModalOpenType}
        wishlistListDetails={wishlistListDetails}
      />
      <Tabs
        active={activeTab}
        className="mt-6"
        enabled={['wishlist', 'bought']}
        items={[
          {
            id: 'wishlist',
            name: t('tabs.wishlist'),
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
            name: t('tabs.bought'),
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
        onNavClick={setActiveTab}
      />
      <APIFallbackComponent data={collectionId}>
        {collectionId => (
          <APIFallbackComponent data={entries}>
            {entries => {
              if (entries.length === 0) {
                return (
                  <EmptyStateScreen
                    ctaContent="new"
                    ctaTProps={{
                      item: t('items.entry')
                    }}
                    icon="tabler:shopping-cart-off"
                    name="entries"
                    namespace="modules.wishlist"
                  />
                )
              }

              return (
                <Scrollbar>
                  <ul className="mb-14 flex flex-col space-y-2 sm:mb-6">
                    {entries.map(entry => (
                      <EntryItem
                        key={entry.id}
                        collectionId={collectionId}
                        entry={entry}
                        setEntries={setEntries}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
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
        setExistedData={setExistedData}
        setModifyEntryModalOpenType={setModifyEntryModalOpenType}
        onClose={() => {
          setFromOtherAppsModalOpen(false)
        }}
      />
      <DeleteConfirmationModal
        apiEndpoint="wishlist/entries"
        data={existedData}
        isOpen={deleteEntryConfirmationModalOpen}
        itemName="entry"
        nameKey="name"
        updateDataList={() => {
          setEntries(prev => {
            if (typeof prev === 'string') {
              return prev
            }
            return prev.filter(e => e.id !== existedData?.id)
          })
        }}
        onClose={() => {
          setDeleteEntryConfirmationModalOpen(false)
        }}
      />
      <ModifyEntryModal
        collectionId={collectionId}
        existedData={existedData}
        lists={lists}
        openType={modifyEntryModalOpenType}
        setEntries={setEntries}
        setOpenType={setModifyEntryModalOpenType}
      />
      <Menu as="div" className="absolute bottom-6 right-6 z-50 block md:hidden">
        <Button as={MenuButton} icon="tabler:plus" onClick={() => {}} />
        <MenuItems
          transition
          anchor="top end"
          className="bg-bg-100 dark:bg-bg-800 outline-hidden focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 overflow-hidden overscroll-contain rounded-md shadow-lg transition duration-100 ease-out [--anchor-gap:8px]"
        >
          <MenuItem
            icon="tabler:plus"
            namespace="modules.wishlist"
            text="Add Manually"
            onClick={() => {}}
          />
          <MenuItem
            icon="tabler:apps"
            namespace="modules.wishlist"
            text="From Other Apps"
            onClick={() => {
              setFromOtherAppsModalOpen(true)
            }}
          />
        </MenuItems>
      </Menu>
    </ModuleWrapper>
  )
}

export default WishlistEntries
