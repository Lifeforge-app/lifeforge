import React from 'react'
import { Link } from 'react-router'
import { type INotesEntry } from '@interfaces/notes_interfaces'

function EntryButton({ entry }: { entry: INotesEntry }): React.ReactElement {
  return entry.type === 'folder' ? (
    <Link
      className="hover:bg-bg-100 dark:hover:bg-bg-900 absolute top-0 left-0 size-full rounded-lg transition-all"
      to={`${location.pathname}/${entry.id}`.replace(/\/\//g, '/')}
    />
  ) : (
    <Link
      className="hover:bg-bg-100 dark:hover:bg-bg-900 absolute top-0 left-0 size-full rounded-lg transition-all"
      rel="noopener noreferrer"
      target="_blank"
      to={`${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
        entry.id
      }/${entry.file}`}
    />
  )
}

export default EntryButton
