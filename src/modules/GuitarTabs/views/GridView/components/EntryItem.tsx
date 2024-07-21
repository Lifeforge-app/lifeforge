import React from 'react'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import type IGuitarTabsEntry from '@interfaces/guitar_tabs_interfaces'

function EntryItem({
  entry,
  setModifyEntryModalOpen,
  setExistingEntry
}: {
  entry: IGuitarTabsEntry
  setModifyEntryModalOpen: (value: boolean) => void
  setExistingEntry: (value: IGuitarTabsEntry) => void
}): React.ReactElement {
  return (
    <a
      key={entry.id}
      href={`${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
        entry.id
      }/${entry.file}`}
      target="_blank"
      className="block rounded-lg bg-bg-50 p-4 shadow-custom hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800/70"
      rel="noreferrer"
    >
      <div className="relative">
        <img
          src={`${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
            entry.id
          }/${entry.thumbnail}?thumb=500x0`}
          alt={entry.name}
          className="h-96 w-full rounded-md bg-bg-100 object-cover object-top dark:bg-bg-800"
        />
        <div className="absolute bottom-0 right-0 rounded-br-md rounded-tl-md bg-bg-500/80 p-1 px-2">
          <p className="text-xs text-white">{entry.pageCount} pages</p>
        </div>
      </div>
      <div className="mt-4 flex w-full min-w-0 items-center justify-between gap-8">
        <div className="w-full min-w-0">
          <h3 className="truncate text-lg font-medium">{entry.name}</h3>
          <p className="text-sm text-bg-500">
            {entry.author !== '' ? entry.author : 'Unknown'}
          </p>
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
      </div>
    </a>
  )
}

export default EntryItem
