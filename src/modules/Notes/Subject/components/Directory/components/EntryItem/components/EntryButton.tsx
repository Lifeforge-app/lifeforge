import React from 'react'
import { Link } from 'react-router-dom'
import { type INotesEntry } from '@interfaces/notes_interfaces'

function EntryButton({ entry }: { entry: INotesEntry }): React.ReactElement {
  return entry.type === 'folder' ? (
    <Link
      className="absolute left-0 top-0 size-full rounded-lg transition-all hover:bg-bg-100 dark:hover:bg-bg-900"
      to={`${location.pathname}/${entry.id}`.replace(/\/\//g, '/')}
    />
  ) : (
    <Link
      className="absolute left-0 top-0 size-full rounded-lg transition-all hover:bg-bg-100 dark:hover:bg-bg-900"
      rel="noopener noreferrer"
      target="_blank"
      to={`${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
        entry.id
      }/${entry.file}`}
    />
  )
}

export default EntryButton
