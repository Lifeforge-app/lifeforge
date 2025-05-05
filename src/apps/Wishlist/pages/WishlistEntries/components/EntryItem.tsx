/* eslint-disable sonarjs/no-useless-react-setstate */
import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { Button, Checkbox, HamburgerMenu, MenuItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'
import useComponentBg from '@hooks/useComponentBg'

import fetchAPI from '@utils/fetchAPI'

import { type IWishlistEntry } from '../../../interfaces/wishlist_interfaces'

function EntryItem({
  entry,
  queryKey
}: {
  entry: IWishlistEntry
  queryKey: unknown[]
}) {
  const open = useModalStore(state => state.open)
  const queryClient = useQueryClient()
  const collectionIdQuery = useAPIQuery<string>(
    'wishlist/entries/collection-id',
    ['wishlist', 'entries', 'collection-id']
  )
  const { componentBg, componentBgLighter } = useComponentBg()
  const [bought, setBought] = useState(entry.bought)

  const toggleBought = () =>
    queryClient.setQueryData<IWishlistEntry[]>(queryKey, prev => {
      if (!prev) return prev

      return prev.filter(e => e.id !== entry.id)
    })

  async function markAsCompleted() {
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

  const handleEdit = useCallback(() => {
    open('wishlist.entries.modifyEntry', {
      type: 'update',
      existedData: entry,
      queryKey
    })
  }, [entry])

  const handleDelete = useCallback(() => {
    open('deleteConfirmation', {
      apiEndpoint: 'wishlist/entries',
      data: entry,
      itemName: 'entry',
      nameKey: 'name',
      queryKey: queryKey
    })
  }, [entry])

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
              className="text-bg-200 dark:text-bg-700 absolute top-1/2 left-1/2 z-[-1] size-8 -translate-x-1/2 -translate-y-1/2"
              icon="tabler:shopping-bag"
            />
            {entry.image !== '' && (
              <img
                alt=""
                className="size-full rounded-md"
                src={`${import.meta.env.VITE_API_HOST}/media/${collectionIdQuery.data}/${
                  entry.id
                }/${entry.image}`}
              />
            )}
          </div>
          <div className="w-full min-w-0">
            <h2 className="line-clamp-2 w-full min-w-0 text-lg font-medium text-zinc-500">
              {entry.name}
            </h2>
            <p className="mt-2 text-2xl">RM {entry.price.toFixed(2)}</p>
            {entry.bought && (
              <p className="mt-2 text-sm text-zinc-500">
                Bought {dayjs(entry.bought_at).fromNow()}
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
          className="w-auto px-0! sm:px-4!"
          href={entry.url}
          icon="iconamoon:arrow-top-right-1"
          namespace="apps.wishlist"
          target="_blank"
          variant="plain"
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
        <HamburgerMenu
          classNames={{
            wrapper: 'absolute right-4 top-4 sm:static'
          }}
        >
          <MenuItem icon="tabler:pencil" text="Edit" onClick={handleEdit} />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={handleDelete}
          />
        </HamburgerMenu>
      </div>
    </li>
  )
}

export default EntryItem
