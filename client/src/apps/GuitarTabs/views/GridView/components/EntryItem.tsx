import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import { DeleteConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

import ModifyEntryModal from '@apps/GuitarTabs/components/modals/ModifyEntryModal'

import AudioPlayer from '../../../components/AudioPlayer'
import DownloadMenu from '../../../components/DownloadMenu'
import { IGuitarTabsEntry } from '../../../interfaces/guitar_tabs_interfaces'

function EntryItem({ entry }: { entry: IGuitarTabsEntry }) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  async function favouriteTab() {
    try {
      await fetchAPI(
        import.meta.env.VITE_API_URL,
        `guitar-tabs/entries/favourite/${entry.id}`,
        {
          method: 'POST'
        }
      )

      queryClient.invalidateQueries({ queryKey: ['guitar-tabs'] })
    } catch {
      toast.error('Failed to add to favourites')
    }
  }

  const handleUpdateEntry = useCallback(() => {
    open(ModifyEntryModal, {
      existedData: entry,
      queryKey: ['guitar-tabs']
    })
  }, [entry])

  const handleDeleteEntry = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'guitar-tabs/entries',
      confirmationText: 'Delete this guitar tab',
      data: entry,
      itemName: 'guitar tab',
      nameKey: 'name',
      queryKey: ['guitar-tabs'],
      queryUpdateType: 'invalidate'
    })
  }, [entry])

  return (
    <a
      key={entry.id}
      className="shadow-custom component-bg-with-hover block rounded-lg p-4 transition-all"
      href={`${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
        entry.id
      }/${entry.pdf}`}
      rel="noreferrer"
      target="_blank"
    >
      <div className="relative">
        <div className="flex-center bg-bg-100 dark:bg-bg-800 relative aspect-[1/1.4142] w-full overflow-hidden rounded-md">
          <Icon
            className="text-bg-300 dark:text-bg-700 absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2"
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
        <div className="bg-bg-500/80 absolute right-0 bottom-0 rounded-tl-md rounded-br-md p-1 px-2">
          <p className="text-xs text-white">{entry.pageCount} pages</p>
        </div>
        <HamburgerMenu
          classNames={{
            wrapper: 'absolute right-2 top-2 shrink-0'
          }}
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
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
            onClick={handleUpdateEntry}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={handleDeleteEntry}
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
        <div className="hidden items-center gap-2 sm:flex">
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
