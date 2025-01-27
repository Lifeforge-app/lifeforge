import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { GoBackButton, Button } from '@components/buttons'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { Loadable } from '@interfaces/common'
import { IWishlistEntry, IWishlistList } from '@interfaces/wishlist_interfaces'

function Header({
  wishlistListDetails,
  setModifyEntryModalOpenType,
  setExistedData,
  setFromOtherAppsModalOpen
}: {
  wishlistListDetails: Loadable<IWishlistList>
  setModifyEntryModalOpenType: (value: 'create' | 'update' | null) => void
  setExistedData: (value: Partial<IWishlistEntry> | null) => void
  setFromOtherAppsModalOpen: (value: boolean) => void
}): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
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
  )
}

export default Header
