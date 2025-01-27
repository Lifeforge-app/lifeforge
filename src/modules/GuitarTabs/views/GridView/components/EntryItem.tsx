import { Icon } from '@iconify/react'
import React from 'react'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
import { type IGuitarTabsEntry } from '@interfaces/guitar_tabs_interfaces'
import APIRequest from '@utils/fetchData'
import DownloadMenu from '../../../components/DownloadMenu'
import AudioPlayer from '../../ListView/components/AudioPlayer'

function EntryItem({
  entry,
  refreshEntries,
  setModifyEntryModalOpen,
  setExistingEntry,
  setDeleteConfirmationModalOpen
}: {
  entry: IGuitarTabsEntry
  refreshEntries: () => void
  setModifyEntryModalOpen: (value: boolean) => void
  setExistingEntry: (value: IGuitarTabsEntry) => void
  setDeleteConfirmationModalOpen: (value: boolean) => void
}): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()

  async function favouriteTab(): Promise<void> {
    await APIRequest({
      endpoint: `guitar-tabs/entries/favourite/${entry.id}`,
      method: 'POST',
      successInfo: entry.isFavourite ? 'unfavourite' : 'favourite',
      failureInfo: entry.isFavourite ? 'unfavourite' : 'favourite',
      callback: refreshEntries
    })
  }

  return (
    <a
      key={entry.id}
      href={`${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
        entry.id
      }/${entry.pdf}`}
      target="_blank"
      className={`block rounded-lg p-4 shadow-custom transition-all ${componentBgWithHover}`}
      rel="noreferrer"
    >
      <div className="relative">
        <div className="flex-center relative aspect-[1/1.4142] w-full overflow-hidden rounded-md bg-bg-100 dark:bg-bg-800">
          <Icon
            icon="mingcute:guitar-line"
            className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 text-bg-300 dark:text-bg-700"
          />
          <img
            key={entry.id}
            src={`${import.meta.env.VITE_API_HOST}/media/${
              entry.collectionId
            }/${entry.id}/${entry.thumbnail}?thumb=500x0`}
            alt=""
            className="relative h-full object-cover object-top"
          />
        </div>
        <div className="absolute bottom-0 right-0 rounded-br-md rounded-tl-md bg-bg-500/80 p-1 px-2">
          <p className="text-xs text-white">{entry.pageCount} pages</p>
        </div>
        <HamburgerMenu
          className="absolute right-2 top-2 shrink-0"
          customTailwindColor="bg-bg-100 hover:bg-bg-200 shadow-custom dark:bg-bg-500/50 dark:hover:bg-bg-500/70"
        >
          <MenuItem
            onClick={() => {
              favouriteTab().catch(console.error)
            }}
            text={entry.isFavourite ? 'Unfavourite' : 'Favourite'}
            icon={entry.isFavourite ? 'tabler:star-off' : 'tabler:star'}
          />
          <MenuItem
            onClick={() => {
              setExistingEntry(entry)
              setModifyEntryModalOpen(true)
            }}
            text="Edit"
            icon="tabler:pencil"
          />
          <MenuItem
            text="Delete"
            icon="tabler:trash"
            isRed
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
            {entry.type !== '' && (
              <Icon
                icon={
                  {
                    fingerstyle: 'mingcute:guitar-line',
                    singalong: 'mdi:guitar-pick-outline'
                  }[entry.type]
                }
                className="size-5 shrink-0 text-bg-500"
              />
            )}
            {entry.isFavourite && (
              <Icon
                icon="tabler:star-filled"
                className="size-4 shrink-0 text-yellow-500"
              />
            )}
          </div>
          <p className="truncate text-sm text-bg-500">
            {entry.author !== '' ? entry.author : 'Unknown'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DownloadMenu entry={entry} />
          {entry.audio !== '' && (
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
