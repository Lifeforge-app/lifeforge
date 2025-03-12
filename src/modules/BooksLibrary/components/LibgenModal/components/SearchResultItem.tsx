import { Icon } from '@iconify/react'
import clsx from 'clsx'
import moment from 'moment'
import React from 'react'

import { Button } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import AddToLibraryButton from './AddToLibraryButton'

function SearchResultItem({
  book,
  setViewDetailsFor,
  setAddToLibraryFor
}: {
  book: Record<string, any>
  setViewDetailsFor: (id: string) => void
  setAddToLibraryFor: (id: string) => void
}): React.ReactElement {
  const { componentBgLighterWithHover } = useComponentBg()

  return (
    <li
      className={clsx(
        'flex flex-col gap-6 rounded-md p-6 md:flex-row',
        componentBgLighterWithHover
      )}
    >
      <div className="flex-center bg-bg-200 dark:bg-bg-800 relative inline-flex h-min min-h-80 w-56 shrink-0 flex-col overflow-hidden rounded-md">
        <Icon
          className="text-bg-700 absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2"
          icon="tabler:book-2"
        />
        {book.image !== '' && (
          <img
            alt=""
            className="relative z-10 border-none object-cover"
            referrerPolicy="no-referrer"
            src={`${import.meta.env.VITE_API_HOST}/books-library/libgen${
              book.image
            }`}
          />
        )}
      </div>
      <div className="-mt-1 w-full">
        <p className="text-bg-500 mb-1 text-sm font-medium tracking-wide">
          {book.ISBN}
        </p>
        <h2 className="text-2xl font-semibold">
          {book.Title}{' '}
          {book.Edition !== '' && (
            <span className="text-bg-500 text-sm">({book.Edition} ed)</span>
          )}
        </h2>
        <p className="text-custom-500 mt-1 text-base font-light">
          {book['Author(s)']}
        </p>
        <div className="mt-6 flex flex-wrap gap-6 lg:grid lg:grid-cols-4">
          {Object.keys(book)
            .filter(
              (key: string) =>
                ![
                  'Title',
                  'Edition',
                  'Author(s)',
                  'image',
                  'md5',
                  'ISBN',
                  'Edit record',
                  'BibTeX',
                  'ID'
                ].includes(key) && book[key] !== ''
            )
            .map((key: string) => (
              <div key={key}>
                <p className="text-bg-500 text-sm font-medium">{key}</p>
                <p className="text-base font-light">
                  {key.includes('Time')
                    ? moment(book[key]).format('MMM DD, YYYY')
                    : book[key]}
                </p>
              </div>
            ))}
        </div>
        <div className="mt-6 flex w-full flex-col items-center gap-2 lg:flex-row lg:gap-4">
          <Button
            className="w-full lg:w-1/2"
            icon="tabler:eye"
            namespace="modules.booksLibrary"
            variant="secondary"
            onClick={() => {
              setViewDetailsFor(book.md5)
            }}
          >
            View Details
          </Button>
          <AddToLibraryButton
            md5={book.md5}
            setAddToLibraryFor={setAddToLibraryFor}
          />
        </div>
      </div>
    </li>
  )
}

export default SearchResultItem
