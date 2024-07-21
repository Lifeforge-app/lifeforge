import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import type IGuitarTabsEntry from '@interfaces/guitar_tabs_interfaces'

function EntryItem({
  entry,
  setExistingEntry,
  setModifyEntryModalOpen
}: {
  entry: IGuitarTabsEntry
  setExistingEntry: React.Dispatch<React.SetStateAction<IGuitarTabsEntry>>
  setModifyEntryModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  return (
    <li
      key={entry.id}
      className="relative rounded-lg bg-bg-50 shadow-custom transition-all hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800/70"
    >
      <a
        key={entry.id}
        href={`${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
          entry.id
        }/${entry.file}`}
        target="_blank"
        className="flex items-center justify-between gap-4 p-4"
        rel="noreferrer"
      >
        <div className="flex w-full min-w-0 items-center gap-4">
          <div className="flex-center flex w-12 rounded-lg bg-bg-200 dark:bg-bg-800">
            <img
              src={`${import.meta.env.VITE_API_HOST}/media/${
                entry.collectionId
              }/${entry.id}/${entry.thumbnail}`}
              className="h-full"
            />
          </div>
          <div className="flex w-full min-w-0 flex-1 flex-col">
            <div className="text-lg font-semibold">{entry.name}</div>
            <div className="flex w-full min-w-0 items-center gap-2 whitespace-nowrap text-sm font-medium text-bg-500">
              <p className="min-w-0 truncate">
                {entry.author !== '' ? entry.author : 'Unknown'}
              </p>
              <Icon icon="tabler:circle-filled" className="size-1" />
              <span>{entry.pageCount} pages</span>
            </div>
          </div>
        </div>
        <HamburgerMenu className="relative shrink-0">
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
            onClick={() => {}}
          />
        </HamburgerMenu>
      </a>
    </li>
  )
}

export default EntryItem
