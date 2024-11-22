import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
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
  return (
    <li className="flex flex-col gap-6 rounded-md bg-bg-800/50 p-6 shadow-custom md:flex-row">
      <div className="flex-center relative inline-flex h-min min-h-80 w-56 shrink-0 flex-col overflow-hidden rounded-md bg-bg-800">
        <Icon
          icon="tabler:book-2"
          className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 text-bg-700"
        />
        {book.image !== '' && (
          <img
            src={`https://libgen.is/${book.image}`}
            referrerPolicy="no-referrer"
            alt=""
            className="relative z-10 border-none object-cover"
          />
        )}
      </div>
      <div className="-mt-1 w-full">
        <p className="mb-1 text-sm font-medium tracking-wide text-bg-500">
          {book.ISBN}
        </p>
        <h2 className="text-2xl font-semibold">
          {book.Title}{' '}
          {book.Edition !== '' && (
            <span className="text-sm text-bg-500">({book.Edition} ed)</span>
          )}
        </h2>
        <p className="mt-1 text-base font-light text-custom-500">
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
                <p className="text-sm font-medium text-bg-500">{key}</p>
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
            onClick={() => {
              setViewDetailsFor(book.md5)
            }}
            variant="secondary"
            icon="tabler:eye"
            className="w-full lg:w-1/2"
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
