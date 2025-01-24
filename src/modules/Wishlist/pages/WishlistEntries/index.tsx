import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { Button , GoBackButton } from '@components/buttons'
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

  return (
    <ModuleWrapper>
      <header className="w-full min-w-0 space-y-1">
        <GoBackButton
          onClick={() => {
            navigate('/wishlist')
          }}
        />
        <div className="flex-between w-full min-w-0 gap-8">
          <h1
            className={`flex items-center gap-4 ${
              typeof wishlistListDetails !== 'string'
                ? 'text-2xl sm:text-3xl'
                : 'text-2xl'
            } w-full min-w-0 font-semibold`}
          >
            {(() => {
              switch (wishlistListDetails) {
                case 'loading':
                  return (
                    <>
                      <span className="small-loader-light"></span>
                      Loading...
                    </>
                  )
                case 'error':
                  return (
                    <>
                      <Icon
                        icon="tabler:alert-triangle"
                        className="mt-0.5 size-7 text-red-500"
                      />
                      Failed to fetch data from server.
                    </>
                  )
                default:
                  return (
                    <>
                      <div
                        className="rounded-lg p-3"
                        style={{
                          backgroundColor: wishlistListDetails.color + '20'
                        }}
                      >
                        <Icon
                          icon={wishlistListDetails.icon}
                          className="text-2xl sm:text-3xl"
                          style={{
                            color: wishlistListDetails.color
                          }}
                        />
                      </div>
                      <div className="w-full min-w-0">
                        <div className="flex items-end gap-2 text-2xl font-medium sm:text-3xl">
                          <span>{wishlistListDetails.name}</span>
                          <div className="!text-lg text-bg-500">
                            ({wishlistListDetails.item_count} items)
                          </div>
                        </div>
                        <span className="block w-full min-w-0 truncate text-base text-bg-500">
                          {wishlistListDetails.description}{' '}
                        </span>
                      </div>
                    </>
                  )
              }
            })()}
          </h1>
          <Menu as="div" className="relative z-50 hidden md:block">
            <Button
              onClick={() => {}}
              icon="tabler:plus"
              className="hidden md:flex"
              as={MenuButton}
            >
              New Item
            </Button>
            <MenuItems
              transition
              anchor="bottom end"
              className="mt-2 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
            >
              <MenuItem
                onClick={() => {
                  setModifyEntryModalOpenType('create')
                  setExistedData({
                    list: id as string
                  })
                }}
                icon="tabler:plus"
                text="Add Manually"
              />
              <MenuItem
                onClick={() => {
                  setFromOtherAppsModalOpen(true)
                }}
                icon="tabler:apps"
                text="From Other Apps"
              />
            </MenuItems>
          </Menu>
        </div>
      </header>
      <Tabs
        items={[
          {
            id: 'wishlist',
            name: 'Wishlist',
            icon: 'tabler:heart',
            amount:
              typeof entries === 'string' ||
              typeof wishlistListDetails === 'string'
                ? 0
                : activeTab === 'wishlist'
                ? entries.length
                : wishlistListDetails.item_count - entries.length
          },
          {
            id: 'bought',
            name: 'Bought',
            icon: 'tabler:check',
            amount:
              typeof entries === 'string' ||
              typeof wishlistListDetails === 'string'
                ? 0
                : activeTab === 'wishlist'
                ? wishlistListDetails.item_count - entries.length
                : entries.length
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
            {entries =>
              entries.length > 0 ? (
                <Scrollbar>
                  <ul className="mb-14 flex flex-col space-y-2 sm:mb-6">
                    {entries.map(entry => (
                      <EntryItem
                        key={entry.id}
                        entry={entry}
                        collectionId={collectionId}
                        setEntries={setEntries}
                        onEdit={() => {
                          setExistedData(entry)
                          setModifyEntryModalOpenType('update')
                        }}
                        onDelete={() => {
                          setExistedData(entry)
                          setDeleteEntryConfirmationModalOpen(true)
                        }}
                      />
                    ))}
                  </ul>
                </Scrollbar>
              ) : (
                <EmptyStateScreen
                  title="No entries"
                  description="Add items to your wishlist"
                  icon="tabler:shopping-cart-off"
                  ctaContent="New Item"
                />
              )
            }
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
