import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { Button, GoBackButton, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'

import { IWishlistList } from '../../../interfaces/wishlist_interfaces'
import FromOtherAppsModal from '../modals/FromOtherAppsModal'
import ModifyEntryModal from '../modals/ModifyEntryModal'

function Header({
  wishlistListDetails
}: {
  wishlistListDetails: IWishlistList
}) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.wishlist')

  const { id } = useParams<{ id: string }>()

  const navigate = useNavigate()

  const handleAddManually = useCallback(() => {
    open(ModifyEntryModal, {
      type: 'create',
      existedData: {
        list: id as string
      }
    })
  }, [id])

  const handleAddFromOtherApps = useCallback(() => {
    open(FromOtherAppsModal, {})
  }, [])

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
            'flex w-full min-w-0 items-center gap-3 font-semibold',
            typeof wishlistListDetails !== 'string'
              ? 'text-2xl sm:text-3xl'
              : 'text-2xl'
          )}
        >
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
                ({wishlistListDetails.total_count} items)
              </div>
            </div>
            <span className="text-bg-500 block w-full min-w-0 truncate text-base">
              {wishlistListDetails.description}{' '}
            </span>
          </div>
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
              namespace="apps.wishlist"
              text="Add Manually"
              onClick={handleAddManually}
            />
            <MenuItem
              icon="tabler:apps"
              namespace="apps.wishlist"
              text="From Other Apps"
              onClick={handleAddFromOtherApps}
            />
          </MenuItems>
        </Menu>
      </div>
    </header>
  )
}

export default Header
