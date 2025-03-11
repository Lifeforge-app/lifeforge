/* eslint-disable sonarjs/no-useless-react-setstate */
import { Icon } from '@iconify/react'
import fetchAPI from '@utils/fetchAPI'
import { numberToMoney } from '@utils/strings'
import clsx from 'clsx'
import moment from 'moment'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { Button, Checkbox, HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { type Loadable } from '@interfaces/common'
import { type IWishlistEntry } from '@interfaces/wishlist_interfaces'

import useThemeColors from '@hooks/useThemeColor'

function EntryItem({
  entry,
  collectionId,
  setEntries,
  onEdit,
  onDelete
}: {
  entry: IWishlistEntry
  collectionId: string
  setEntries: React.Dispatch<React.SetStateAction<Loadable<IWishlistEntry[]>>>
  onEdit: (entry: IWishlistEntry) => void
  onDelete: (entry: IWishlistEntry) => void
}): React.ReactElement {
  const { componentBg, componentBgLighter } = useThemeColors()
  const [bought, setBought] = useState(entry.bought)

  const toggleBought = () =>
    setEntries(prev => {
      if (typeof prev === 'string') {
        return prev
      }
      return prev.filter(e => e.id !== entry.id)
    })

  async function markAsCompleted(): Promise<void> {
    setBought(!bought)

    try {
      await fetchAPI(`wishlist/entries/bought/${entry.id}`, {
        method: 'PATCH'
      })

      setTimeout(toggleBought, 500)
    } catch {
      toast.error('Failed to update entry completion status')
      setBought(bought)
    }
  }

  return (
    <li
      className={clsx(
        'relative flex flex-col justify-between gap-4 rounded-md p-4 sm:pr-8 md:flex-row md:items-center',
        componentBg
      )}
    >
      <div className="flex-between gap-8">
        <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
          <div
            className={clsx(
              'relative isolate aspect-square h-auto w-full shrink-0 overflow-hidden rounded-md sm:w-20',
              componentBgLighter
            )}
          >
            <Icon
              className="text-bg-200 dark:text-bg-700 absolute left-1/2 top-1/2 z-[-1] size-8 -translate-x-1/2 -translate-y-1/2"
              icon="tabler:shopping-bag"
            />
            {entry.image !== '' && (
              <img
                alt=""
                className="size-full rounded-md"
                src={`${import.meta.env.VITE_API_HOST}/media/${collectionId}/${
                  entry.id
                }/${entry.image}`}
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
          className="hidden! sm:flex! md:hidden!"
          onChange={() => {
            markAsCompleted().catch(console.error)
          }}
        />
      </div>
      <div className="flex-between gap-4">
        <Button
          iconAtEnd
          as="a"
          className="px-0! sm:px-4! w-auto"
          href={entry.url}
          icon="iconamoon:arrow-top-right-1"
          namespace="modules.wishlist"
          target="_blank"
          variant="no-bg"
        >
          Visit Website
        </Button>
        <Checkbox
          checked={bought}
          className="flex! sm:hidden! md:flex!"
          onChange={() => {
            markAsCompleted().catch(console.error)
          }}
        />
        <HamburgerMenu className="absolute right-4 top-4 sm:static">
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={() => {
              onEdit(entry)
            }}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={() => {
              onDelete(entry)
            }}
          />
        </HamburgerMenu>
      </div>
    </li>
  )
}

export default EntryItem
