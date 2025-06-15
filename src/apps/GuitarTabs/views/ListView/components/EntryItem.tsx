import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import fetchAPI from '@utils/fetchAPI'

import AudioPlayer from '../../../components/AudioPlayer'
import DownloadMenu from '../../../components/DownloadMenu'
import { type IGuitarTabsEntry } from '../../../interfaces/guitar_tabs_interfaces'

function EntryItem({
  entry,
  queryKey
}: {
  entry: IGuitarTabsEntry
  queryKey: unknown[]
}) {
  const { componentBgWithHover } = useComponentBg()
  const open = useModalStore(state => state.open)
  const queryClient = useQueryClient()

  async function favouriteTab() {
    try {
      await fetchAPI(`guitar-tabs/entries/favourite/${entry.id}`, {
        method: 'POST'
      })

      queryClient.invalidateQueries({ queryKey: ['guitar-tabs', 'entries'] })
    } catch {
      toast.error('Failed to add to favourites')
    }
  }

  const handleUpdateEntry = useCallback(() => {
    open('guitarTabs.modifyEntry', {
      type: 'update',
      existedData: entry
    })
  }, [entry])

  const handleDeleteEntry = useCallback(() => {
    open('deleteConfirmation', {
      apiEndpoint: 'guitar-tabs/entries',
      confirmationText: 'Delete this guitar tab',
      data: entry,
      itemName: 'guitar tab',
      nameKey: 'name',
      queryKey
    })
  }, [entry])

  return (
    <li
      key={entry.id}
      className={clsx(
        'shadow-custom relative rounded-lg transition-all',
        componentBgWithHover
      )}
    >
      <a
        key={entry.id}
        className="flex items-center justify-between gap-3 p-4"
        href={`${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
          entry.id
        }/${entry.pdf}`}
        rel="noreferrer"
        target="_blank"
      >
        <div className="flex w-full min-w-0 items-center gap-3">
          <div className="flex-center bg-bg-200 dark:bg-bg-800 w-12 rounded-lg">
            <img
              alt=""
              className="h-full"
              src={`${import.meta.env.VITE_API_HOST}/media/${
                entry.collectionId
              }/${entry.id}/${entry.thumbnail}`}
            />
          </div>
          <div className="flex w-full min-w-0 flex-1 flex-col">
            <div className="flex w-full items-center gap-2">
              <h3 className="truncate text-lg font-semibold">{entry.name}</h3>
              {entry.type !== '' && (
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
            <div className="text-bg-500 flex w-full min-w-0 items-center gap-2 text-sm font-medium whitespace-nowrap">
              <p className="min-w-0 truncate">
                {entry.author !== '' ? entry.author : 'Unknown'}
              </p>
              <Icon className="size-1" icon="tabler:circle-filled" />
              <span>{entry.pageCount} pages</span>
            </div>
          </div>
        </div>
        {entry.audio && (
          <AudioPlayer
            url={`${import.meta.env.VITE_API_HOST}/media/${
              entry.collectionId
            }/${entry.id}/${entry.audio}`}
          />
        )}
        <DownloadMenu entry={entry} />
        <HamburgerMenu>
          <MenuItem
            icon={entry.isFavourite ? 'tabler:star-off' : 'tabler:star'}
            text={entry.isFavourite ? 'Unfavourite' : 'Favourite'}
            onClick={e => {
              e.preventDefault()
              favouriteTab()
            }}
          />
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={handleUpdateEntry}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={handleDeleteEntry}
          />
        </HamburgerMenu>
      </a>
    </li>
  )
}

export default EntryItem
