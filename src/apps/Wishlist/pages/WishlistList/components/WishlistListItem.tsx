import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useCallback } from 'react'
import { Link } from 'react-router'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { IWishlistList } from '@apps/Wishlist/interfaces/wishlist_interfaces'

import useComponentBg from '@hooks/useComponentBg'

function WishlistListItem({ list }: { list: IWishlistList }) {
  const open = useModalStore(state => state.open)
  const { componentBgWithHover } = useComponentBg()

  const handleUpdateList = useCallback(() => {
    open('wishlist.lists.modifyWishlistList', {
      type: 'update',
      existedData: list
    })
  }, [list])

  const handleDeleteList = useCallback(() => {
    open('deleteConfirmation', {
      apiEndpoint: 'wishlist/lists',
      confirmationText: 'Delete this wishlist',
      data: list,
      itemName: 'wishlist',
      nameKey: 'name',
      queryKey: ['wishlist', 'lists']
    })
  }, [list])

  return (
    <Link
      className={clsx(
        'group relative flex w-full flex-col gap-6 rounded-md p-4',
        componentBgWithHover
      )}
      to={`/wishlist/${list.id}`}
    >
      <div
        className="w-min rounded-md p-4"
        style={{
          backgroundColor: list.color + '20',
          color: list.color
        }}
      >
        <Icon className="size-8" icon={list.icon} />
      </div>
      <div className="w-full min-w-0 flex-1 space-y-2">
        <h2 className="truncate text-2xl font-semibold">{list.name}</h2>
        <p className="text-bg-500 min-w-0">{list.description}</p>
      </div>
      <div className="text-right">
        <div className="flex-between text-bg-500 text-sm whitespace-nowrap">
          <p>{list.bought_count} bought</p>
          <p>{list.item_count} items</p>
        </div>
        <progress
          className="progress bg-bg-200 dark:bg-bg-700 h-2 w-full rounded-lg"
          max="100"
          value={
            list.bought_count !== 0
              ? (list.bought_count / list.item_count) * 100
              : 0
          }
        ></progress>
        <div className="flex-between text-bg-500 text-sm">
          <p>
            {list.bought_count === 0
              ? '0'
              : Math.round((list.bought_count / list.item_count) * 100)}
            %
          </p>
          <p>total RM{list.total_amount.toFixed(2)}</p>
        </div>
      </div>
      <HamburgerMenu
        classNames={{
          wrapper: 'absolute right-4 top-4'
        }}
      >
        <MenuItem icon="tabler:pencil" text="Edit" onClick={handleUpdateList} />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={handleDeleteList}
        />
      </HamburgerMenu>
    </Link>
  )
}

export default WishlistListItem
