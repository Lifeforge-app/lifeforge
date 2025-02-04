import { Icon } from '@iconify/react'
import React from 'react'
import { Link } from 'react-router-dom'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
import { type IWishlistList } from '@interfaces/wishlist_interfaces'
import { numberToMoney } from '@utils/strings'

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
      className={`group relative flex w-full flex-col gap-6 rounded-md p-4 ${componentBgWithHover}`}
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
        <p className="min-w-0 text-bg-500">{list.description}</p>
      </div>
      <div className="text-right">
        <div className="flex-between whitespace-nowrap text-sm text-bg-500">
          <p>{list.bought_count} bought</p>
          <p>{list.item_count} items</p>
        </div>
        <progress
          className="progress h-2 w-full rounded-lg bg-bg-200 dark:bg-bg-700"
          max="100"
          value={
            list.bought_count !== 0
              ? (list.bought_count / list.item_count) * 100
              : 0
          }
        ></progress>
        <div className="flex-between text-sm text-bg-500">
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
