import { Icon } from '@iconify/react'
import { Button } from 'lifeforge-ui'

import type { AnnasSearchResult } from '..'

function SearchResultItem({
  book
}: {
  book: AnnasSearchResult['results'][number]
}) {
  const handleOpenDownloadPage = () => {
    window.open(
      `https://annas-archive.org/md5/${book.md5}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <li className="component-bg-lighter-with-hover flex flex-col gap-6 rounded-md p-6 md:flex-row">
      <div className="flex-center bg-bg-200 dark:bg-bg-800 relative inline-flex h-min min-h-80 w-56 shrink-0 flex-col overflow-hidden rounded-md">
        <Icon
          className="text-bg-700 absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2"
          icon="tabler:book-2"
        />
        {book.coverUrl && (
          <img
            alt=""
            className="relative z-10 border-none object-cover"
            referrerPolicy="no-referrer"
            src={book.coverUrl}
          />
        )}
      </div>
      <div className="-mt-1 flex w-full flex-col">
        <p className="text-bg-500 mb-1 text-sm font-medium tracking-wide break-all">
          {book.filePath}
        </p>
        <h2 className="text-2xl font-semibold">{book.title}</h2>
        {book.author && (
          <p className="text-custom-500 mt-1 text-base font-light">
            {book.author}
          </p>
        )}
        {book.description && (
          <p className="text-bg-600 mt-2 line-clamp-3 text-sm">
            {book.description}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-6 gap-y-4 lg:grid lg:grid-cols-4">
          {book.publisher && (
            <div>
              <p className="text-bg-500 text-sm font-medium">Publisher</p>
              <p className="text-base font-light">{book.publisher}</p>
            </div>
          )}
          {book.year && (
            <div>
              <p className="text-bg-500 text-sm font-medium">Year</p>
              <p className="text-base font-light">{book.year}</p>
            </div>
          )}
          {book.language && (
            <div>
              <p className="text-bg-500 text-sm font-medium">Language</p>
              <p className="text-base font-light">{book.language}</p>
            </div>
          )}
          {book.format && (
            <div>
              <p className="text-bg-500 text-sm font-medium">Format</p>
              <p className="text-base font-light">{book.format}</p>
            </div>
          )}
          {book.fileSize && (
            <div>
              <p className="text-bg-500 text-sm font-medium">Size</p>
              <p className="text-base font-light">{book.fileSize}</p>
            </div>
          )}
          {book.type && (
            <div>
              <p className="text-bg-500 text-sm font-medium">Type</p>
              <p className="text-base font-light">{book.type}</p>
            </div>
          )}
        </div>
        <div className="flex flex-1 items-end justify-end">
          <div className="mt-6 flex w-full flex-col items-center gap-2 lg:flex-row lg:gap-3">
            <Button
              className="w-full"
              icon="tabler:download"
              namespace="apps.booksLibrary"
              variant="primary"
              onClick={handleOpenDownloadPage}
            >
              Open Download Page
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SearchResultItem
