import { Icon } from '@iconify/react'
import { numberToMoney } from '@utils/strings'
import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { type IWishlistList } from '@interfaces/wishlist_interfaces'

import useThemeColors from '@hooks/useThemeColor'

function WishlistListItem({
  list,
  onEdit,
  onDelete
}: {
  list: IWishlistList
  onEdit: () => void
  onDelete: () => void
}): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()

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
        <div className="flex-between text-bg-500 whitespace-nowrap text-sm">
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
          <p>total RM{numberToMoney(list.total_amount)}</p>
        </div>
      </div>
      <HamburgerMenu className="absolute right-4 top-4">
        <MenuItem icon="tabler:pencil" text="Edit" onClick={onEdit} />
        <MenuItem isRed icon="tabler:trash" text="Delete" onClick={onDelete} />
      </HamburgerMenu>
    </Link>
  )
}

export default WishlistListItem
