import React from 'react'
import type IGuitarTabsEntry from '@interfaces/guitar_tabs_interfaces'

function EntryItem({ entry }: { entry: IGuitarTabsEntry }): React.ReactElement {
  return (
    <div
      key={entry.id}
      className="rounded-lg bg-bg-50 p-4 shadow-custom hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800/70"
    >
      <img
        src={`${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
          entry.id
        }/${entry.thumbnail}?thumb=500x0`}
        alt={entry.name}
        className="h-96 w-full rounded-md bg-bg-800 object-contain object-top"
      />
      <div className="mt-4">
        <h3 className="truncate text-lg font-medium">
          {entry.name.replace(/\.pdf$/, '')}
        </h3>
        <p className="text-sm text-bg-500">{entry.pageCount} pages</p>
      </div>
    </div>
  )
}

export default EntryItem
