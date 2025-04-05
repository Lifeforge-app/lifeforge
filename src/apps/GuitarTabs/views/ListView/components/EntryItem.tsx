import { Icon } from '@iconify/react'
import clsx from 'clsx'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import AudioPlayer from '../../../components/AudioPlayer'
import DownloadMenu from '../../../components/DownloadMenu'
import { type IGuitarTabsEntry } from '../../../interfaces/guitar_tabs_interfaces'

function EntryItem({
  entry,
  setExistingEntry,
  setModifyEntryModalOpen,
  setDeleteConfirmationModalOpen
}: {
  entry: IGuitarTabsEntry
  setExistingEntry: React.Dispatch<React.SetStateAction<IGuitarTabsEntry>>
  setModifyEntryModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setDeleteConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { componentBgWithHover } = useComponentBg()

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
        className="flex items-center justify-between gap-4 p-4"
        href={`${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
          entry.id
        }/${entry.pdf}`}
        rel="noreferrer"
        target="_blank"
      >
        <div className="flex w-full min-w-0 items-center gap-4">
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
      </a>
    </li>
  )
}

export default EntryItem
