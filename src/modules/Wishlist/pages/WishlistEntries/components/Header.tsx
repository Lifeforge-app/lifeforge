import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('modules.wishlist')
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
          className={clsx(
            'flex w-full min-w-0 items-center gap-4 font-semibold',
            typeof wishlistListDetails !== 'string'
              ? 'text-2xl sm:text-3xl'
              : 'text-2xl'
          )}
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
                      className="mt-0.5 size-7 text-red-500"
                      icon="tabler:alert-triangle"
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
                        className="text-2xl sm:text-3xl"
                        icon={wishlistListDetails.icon}
                        style={{
                          color: wishlistListDetails.color
                        }}
                      />
                    </div>
                    <div className="w-full min-w-0">
                      <div className="flex items-end gap-2 text-2xl font-medium sm:text-3xl">
                        <span>{wishlistListDetails.name}</span>
                        <div className="text-bg-500 text-lg!">
                          ({wishlistListDetails.item_count} items)
                        </div>
                      </div>
                      <span className="text-bg-500 block w-full min-w-0 truncate text-base">
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
            as={MenuButton}
            className="hidden md:flex"
            icon="tabler:plus"
            tProps={{ item: t('items.entry') }}
            onClick={() => {}}
          >
            new
          </Button>
          <MenuItems
            transition
            anchor="bottom end"
            className="bg-bg-100 dark:bg-bg-800 mt-2 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
          >
            <MenuItem
              icon="tabler:plus"
              namespace="modules.wishlist"
              text="Add Manually"
              onClick={() => {
                setModifyEntryModalOpenType('create')
                setExistedData({
                  list: id as string
                })
              }}
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
      </div>
    </header>
  )
}

export default Header
