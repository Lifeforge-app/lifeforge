import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import prettyBytes from 'pretty-bytes'

import { Button } from '@lifeforge/ui'

import AddToLibraryButton from './AddToLibraryButton'

function SearchResultItem({
  book,
  isLibgenIS,
  setViewDetailsFor
}: {
  book: Record<string, any>
  isLibgenIS: boolean
  setViewDetailsFor: (id: string) => void
}) {
  return (
    <li className="component-bg-lighter-with-hover flex flex-col gap-6 rounded-md p-6 md:flex-row">
      <div className="flex-center bg-bg-200 dark:bg-bg-800 relative inline-flex h-min min-h-80 w-56 shrink-0 flex-col overflow-hidden rounded-md">
        <Icon
          className="text-bg-700 absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2"
          icon="tabler:book-2"
        />
        {book.image !== '' && (
          <img
            alt=""
            className="relative z-10 border-none object-cover"
            referrerPolicy="no-referrer"
            src={book.image}
          />
        )}
      </div>
      <div className="-mt-1 flex w-full flex-col">
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
        <div className="mt-6 flex flex-wrap gap-6 gap-y-4 lg:grid lg:grid-cols-4">
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
                    ? dayjs(book[key]).format('MMM DD, YYYY')
                    : key === 'Size' && typeof book[key] === 'number'
                      ? prettyBytes(book[key])
                      : book[key]}
                </p>
              </div>
            ))}
        </div>
        <div className="flex flex-1 items-end justify-end">
          <div className="mt-6 flex w-full flex-col items-center gap-2 lg:flex-row lg:gap-3">
            {isLibgenIS && (
              <Button
                className="w-full lg:w-1/2!"
                icon="tabler:eye"
                namespace="apps.booksLibrary"
                variant="secondary"
                onClick={() => {
                  setViewDetailsFor(book.md5)
                }}
              >
                View Details
              </Button>
            )}
            <AddToLibraryButton fullWidth book={book} isLibgenIS={isLibgenIS} />
          </div>
        </div>
      </div>
    </li>
  )
}

export default SearchResultItem
