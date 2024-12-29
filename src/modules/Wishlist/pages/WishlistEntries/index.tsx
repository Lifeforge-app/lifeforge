import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import {
  type IWishlistEntry,
  type IWishlistList
} from '@interfaces/wishlist_interfaces'
import EntryItem from './components/EntryItem'
import FromOtherAppsModal from './components/FromOtherAppsModal'

function WishlistEntries(): React.ReactElement {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [valid] = useFetch<boolean>(`wishlist/lists/valid/${id}`)
  const [wishlistListDetails] = useFetch<IWishlistList>(
    `wishlist/lists/${id}`,
    valid === true
  )
  const [entries, refreshEntries] = useFetch<IWishlistEntry[]>(
    `wishlist/entries/${id}`,
    valid === true
  )
  const [collectionId] = useFetch<string>(
    'wishlist/entries/collection-id',
    valid === true
  )
  const [isFromOtherAppsModalOpen, setFromOtherAppsModalOpen] = useState(false)

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      toast.error('Invalid ID')
      navigate('/wishlist')
    }
  }, [valid])

  return (
    <ModuleWrapper>
      <header className="flex-between flex">
        <div className="space-y-1">
          <GoBackButton
            onClick={() => {
              navigate('/wishlist')
            }}
          />
          <div className="flex-between flex">
            <h1
              className={`flex items-center gap-4 ${
                typeof wishlistListDetails !== 'string'
                  ? 'text-2xl sm:text-3xl'
                  : 'text-2xl'
              } font-semibold `}
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
                        {wishlistListDetails.name}
                      </>
                    )
                }
              })()}
            </h1>
          </div>
        </div>
        <Menu as="div" className="relative z-50 hidden md:block">
          <Button
            onClick={() => {}}
            icon="tabler:plus"
            className="hidden md:flex"
            CustomElement={MenuButton}
          >
            New Item
          </Button>
          <MenuItems
            transition
            anchor="bottom end"
            className="mt-2 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
          >
            <MenuItem
              onClick={() => {}}
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
      </header>
      <APIComponentWithFallback data={collectionId}>
        {collectionId => (
          <APIComponentWithFallback data={entries}>
            {entries =>
              entries.length > 0 ? (
                <Scrollbar>
                  <ul className="mt-6 flex flex-col space-y-2">
                    {entries.map(entry => (
                      <EntryItem
                        key={entry.id}
                        entry={entry}
                        collectionId={collectionId}
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
          </APIComponentWithFallback>
        )}
      </APIComponentWithFallback>
      <FromOtherAppsModal
        isOpen={isFromOtherAppsModalOpen}
        onClose={() => {
          setFromOtherAppsModalOpen(false)
        }}
        onCreate={refreshEntries}
      />
      <Menu as="div" className="absolute bottom-6 right-6 z-50 block md:hidden">
        <Button
          onClick={() => {}}
          icon="tabler:plus"
          CustomElement={MenuButton}
        />
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
