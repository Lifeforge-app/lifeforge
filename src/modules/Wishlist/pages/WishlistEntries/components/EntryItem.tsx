import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React, { useState } from 'react'
import { Button , Checkbox } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
import { type IWishlistEntry } from '@interfaces/wishlist_interfaces'
import APIRequest from '@utils/fetchData'
import { numberToMoney } from '@utils/strings'

function EntryItem({
  entry,
  collectionId,
  setEntries,
  onEdit,
  onDelete
}: {
  entry: IWishlistEntry
  collectionId: string
  setEntries: React.Dispatch<
    React.SetStateAction<IWishlistEntry[] | 'loading' | 'error'>
  >
  onEdit: () => void
  onDelete: () => void
}): React.ReactElement {
  const { componentBg, componentBgLighter } = useThemeColors()
  const [bought, setBought] = useState(entry.bought)

  async function markAsCompleted(id: string): Promise<void> {
    setBought(!bought)

    await APIRequest({
      endpoint: `wishlist/entries/bought/${id}`,
      method: 'PATCH',
      failureInfo: 'update',
      onFailure: () => {
        setBought(bought)
      },
      callback() {
        setTimeout(() => {
          setEntries(prev => {
            if (typeof prev === 'string') {
              return prev
            }
            return prev.filter(e => e.id !== id)
          })
        }, 500)
      }
    })
  }

  return (
    <li
      className={`${componentBg} relative flex flex-col justify-between gap-4 rounded-md p-4 sm:pr-8 md:flex-row md:items-center`}
    >
      <div className="flex-between gap-8">
        <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
          <div
            className={`${componentBgLighter} relative isolate aspect-square h-auto w-full shrink-0 overflow-hidden rounded-md sm:w-20`}
          >
            <Icon
              icon="tabler:shopping-bag"
              className="absolute left-1/2 top-1/2 z-[-1] size-8 -translate-x-1/2 -translate-y-1/2 text-bg-200 dark:text-bg-700"
            />
            {entry.image !== '' && (
              <img
                src={`${import.meta.env.VITE_API_HOST}/media/${collectionId}/${
                  entry.id
                }/${entry.image}`}
                alt=""
                className="size-full rounded-md"
              />
            )}
          </div>
          <div className="w-full min-w-0">
            <h2 className="line-clamp-2 w-full min-w-0 text-lg font-medium text-zinc-500">
              {entry.name}
            </h2>
            <p className="mt-2 text-2xl">RM {numberToMoney(entry.price)}</p>
            {entry.bought && (
              <p className="mt-2 text-sm text-zinc-500">
                Bought {moment(entry.bought_at).fromNow()}
              </p>
            )}
          </div>
        </div>
        <Checkbox
          checked={bought}
          onChange={() => {
            markAsCompleted(entry.id).catch(console.error)
          }}
          className="!hidden sm:!flex md:!hidden"
        />
      </div>
      <div className="flex-between gap-4">
        <Button
          as="a"
          href={entry.url}
          target="_blank"
          variant="no-bg"
          className="w-auto !px-0 sm:!px-4"
          icon="iconamoon:arrow-top-right-1"
          iconAtEnd
        >
          Visit Website
        </Button>
        <Checkbox
          checked={bought}
          onChange={() => {
            markAsCompleted(entry.id).catch(console.error)
          }}
          className="!flex sm:!hidden md:!flex"
        />
        <HamburgerMenu className="absolute right-4 top-4 sm:static">
          <MenuItem icon="tabler:pencil" text="Edit" onClick={onEdit} />
          <MenuItem
            icon="tabler:trash"
            text="Delete"
            onClick={onDelete}
            isRed
          />
        </HamburgerMenu>
      </div>
    </li>
  )
}

export default EntryItem
