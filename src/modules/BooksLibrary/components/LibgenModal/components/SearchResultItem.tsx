import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import APIRequest from '@utils/fetchData'

function SearchResultItem({
  book,
  setViewDetailsFor
}: {
  book: Record<string, any>
  setViewDetailsFor: (id: string) => void
}): React.ReactElement {
  async function addToLibrary(): Promise<void> {
    await APIRequest({
      endpoint: `books-library/libgen/add-to-library/${book.md5}`,
      method: 'POST'
    })
  }

  return (
    <li className="flex gap-6 rounded-md bg-bg-800/50 p-6 shadow-custom">
      <div className="relative h-min w-56 shrink-0 overflow-hidden rounded-md bg-bg-800">
        <Icon
          icon="tabler:book-2"
          className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 text-bg-700"
        />
        {book.image !== '' && (
          <img
            src={`http://libgen.is/${book.image}`}
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
        <div className="mt-6 grid grid-cols-4 gap-6">
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
        <div className="mt-6 flex w-full items-center gap-4">
          <Button
            onClick={() => {
              setViewDetailsFor(book.md5)
            }}
            variant="secondary"
            icon="tabler:eye"
            className="w-1/2"
          >
            View Details
          </Button>
          <Button
            onClick={() => {
              addToLibrary().catch(console.error)
            }}
            icon="tabler:plus"
            className="w-1/2"
          >
            Add to Library
          </Button>
        </div>
      </div>
    </li>
  )
}

export default SearchResultItem
