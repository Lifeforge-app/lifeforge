import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { Link } from 'react-router-dom'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
import { type IWishlistList } from '@interfaces/wishlist_interfaces'
import { numberToMoney } from '@utils/strings'

function WishlistListItem({
  list,
  setExistedData,
  setModifyWishlistListModalOpenType
}: {
  list: IWishlistList
  setExistedData: React.Dispatch<React.SetStateAction<IWishlistList | null>>
  setModifyWishlistListModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
}): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()

  return (
    <Link
      to={`/wishlist/${list.id}`}
      className={`flex-between group relative flex w-full gap-8 rounded-md p-4 ${componentBgWithHover}`}
    >
      <div className="flex w-full min-w-0 items-center">
        <div
          className="rounded-md p-4"
          style={{
            backgroundColor: list.color + '20',
            color: list.color
          }}
        >
          <Icon icon={list.icon} className="size-8" />
        </div>
        <div className="ml-4 w-full min-w-0">
          <h2 className="truncate text-xl font-semibold">{list.name}</h2>
          <p className="min-w-0 truncate text-sm text-bg-500">
            {list.description}
          </p>
        </div>
      </div>
      <div className="space-y-2 text-right">
        <p className="text-sm text-bg-500">{list.item_count} items</p>
        <p className="whitespace-nowrap text-sm text-bg-500">
          totalling RM {numberToMoney(list.total_amount)}
        </p>
      </div>
      <Menu as="div" className="absolute right-2 top-2">
        <MenuButton>
          {({ open }) => (
            <div
              className={`shrink-0 rounded-lg bg-bg-50 p-2 text-bg-500 opacity-0 hover:bg-bg-100 hover:text-bg-800 group-hover:opacity-100 dark:bg-bg-700 dark:text-bg-50 dark:hover:bg-bg-600 dark:hover:text-bg-50 ${
                open ? '!opacity-100' : ''
              }`}
            >
              <Icon icon="tabler:dots-vertical" className="text-xl" />
            </div>
          )}
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom end"
          className="mt-2 min-w-56 overflow-hidden rounded-md bg-bg-100 shadow-lg outline-none transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
        >
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={() => {
              setModifyWishlistListModalOpenType('update')
              setExistedData(list)
            }}
          />
          <MenuItem
            icon="tabler:trash"
            text="Delete"
            onClick={() => {}}
            isRed
          />
        </MenuItems>
      </Menu>
    </Link>
  )
}

export default WishlistListItem
