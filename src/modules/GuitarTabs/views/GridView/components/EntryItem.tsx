import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { toast } from 'react-toastify'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import fetchAPI from '@utils/fetchAPI'

import DownloadMenu from '../../../components/DownloadMenu'
import { IGuitarTabsEntry } from '../../../interfaces/guitar_tabs_interfaces'
import AudioPlayer from '../../ListView/components/AudioPlayer'

function EntryItem({
  entry,
  setModifyEntryModalOpen,
  setExistingEntry,
  setDeleteConfirmationModalOpen,
  queryKey
}: {
  entry: IGuitarTabsEntry
  setModifyEntryModalOpen: (value: boolean) => void
  setExistingEntry: (value: IGuitarTabsEntry) => void
  setDeleteConfirmationModalOpen: (value: boolean) => void
  queryKey: unknown[]
}) {
  const queryClient = useQueryClient()
  const { componentBgWithHover } = useComponentBg()

  async function favouriteTab() {
    try {
      await fetchAPI(`guitar-tabs/entries/favourite/${entry.id}`, {
        method: 'POST'
      })

      queryClient.setQueryData(queryKey, (data: IGuitarTabsEntry[]) => {
        return data.map(item => {
          if (item.id === entry.id) {
            return { ...item, isFavourite: !item.isFavourite }
          }

          return item
        })
      })
    } catch {
      toast.error('Failed to add to favourites')
    }
  }

  return (
    <a
      key={entry.id}
      className={clsx(
        'shadow-custom block rounded-lg p-4 transition-all',
        componentBgWithHover
      )}
      href={`${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
        entry.id
      }/${entry.pdf}`}
      rel="noreferrer"
      target="_blank"
    >
      <div className="relative">
        <div className="flex-center bg-bg-100 dark:bg-bg-800 relative aspect-[1/1.4142] w-full overflow-hidden rounded-md">
          <Icon
            className="text-bg-300 dark:text-bg-700 absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2"
            icon="mingcute:guitar-line"
          />
          <img
            key={entry.id}
            alt=""
            className="relative h-full object-cover object-top"
            src={`${import.meta.env.VITE_API_HOST}/media/${
              entry.collectionId
            }/${entry.id}/${entry.thumbnail}?thumb=500x0`}
          />
        </div>
        <div className="bg-bg-500/80 absolute bottom-0 right-0 rounded-br-md rounded-tl-md p-1 px-2">
          <p className="text-xs text-white">{entry.pageCount} pages</p>
        </div>
        <HamburgerMenu
          classNames={{
            wrapper: 'absolute right-2 top-2 shrink-0'
          }}
        >
          <MenuItem
            icon={entry.isFavourite ? 'tabler:star-off' : 'tabler:star'}
            text={entry.isFavourite ? 'Unfavourite' : 'Favourite'}
            onClick={() => {
              favouriteTab().catch(console.error)
            }}
          />
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={() => {
              setExistingEntry(entry)
              setModifyEntryModalOpen(true)
            }}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={() => {
              setExistingEntry(entry)
              setDeleteConfirmationModalOpen(true)
            }}
          />
        </HamburgerMenu>
      </div>
      <div className="mt-4 flex w-full min-w-0 items-center justify-between gap-8">
        <div className="w-full min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-medium">{entry.name}</h3>
            {entry.type && (
              <Icon
                className="text-bg-500 size-5 shrink-0"
                icon={
                  {
                    fingerstyle: 'mingcute:guitar-line',
                    singalong: 'mdi:guitar-pick-outline'
                  }[entry.type]
                }
              />
            )}
            {entry.isFavourite && (
              <Icon
                className="size-4 shrink-0 text-yellow-500"
                icon="tabler:star-filled"
              />
            )}
          </div>
          <p className="text-bg-500 truncate text-sm">
            {entry.author || 'Unknown'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DownloadMenu entry={entry} />
          {entry.audio && (
            <AudioPlayer
              url={`${import.meta.env.VITE_API_HOST}/media/${
                entry.collectionId
              }/${entry.id}/${entry.audio}`}
            />
          )}
        </div>
      </div>
    </a>
  )
}

export default EntryItem
