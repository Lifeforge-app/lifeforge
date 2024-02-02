/* eslint-disable multiline-ternary */
import React from 'react'
import { Link } from 'react-router-dom'
import { type INotesEntry } from '../../../../..'

function EntryButton({ entry }: { entry: INotesEntry }): React.ReactElement {
  return entry.type === 'folder' ? (
    <Link
      to={`./${entry.id}`}
      className="absolute left-0 top-0 h-full w-full rounded-lg hover:bg-bg-100 dark:hover:bg-bg-900"
    />
  ) : (
    <a
      href={`${import.meta.env.VITE_POCKETBASE_ENDPOINT}/api/files/${
        entry.collectionId
      }/${entry.id}/${entry.file}`}
      target="_blank"
      rel="noreferrer"
      className="absolute left-0 top-0 h-full w-full rounded-lg hover:bg-bg-100 dark:hover:bg-bg-900"
    />
  )
}

export default EntryButton
