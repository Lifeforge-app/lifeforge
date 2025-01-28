import { Icon } from '@iconify/react'
import React from 'react'
import Scrollbar from '@components/utilities/Scrollbar'
import { type IBooksLibraryEntry } from '@interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import EntryItem from './components/EntryItem'
import BookMeta from '../components/BookMeta'

function GridView({
  books
}: {
  books: IBooksLibraryEntry[]
}): React.ReactElement {
  const {
    miscellaneous: { processes },
    categories: { data: categories }
  } = useBooksLibraryContext()

  return (
    <Scrollbar className="mt-6">
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 px-4 pb-8 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] sm:gap-4">
        {Object.entries(processes).map(([key, value]) => (
          <li
            key={key}
            className="relative flex w-full min-w-0 flex-col items-start rounded-lg bg-bg-50 p-4 transition-all dark:bg-bg-900"
          >
            <div className="flex-center absolute left-0 top-0 size-full rounded-lg bg-bg-50/50 p-8 text-center font-medium dark:bg-bg-900/70">
              Downloading... {value.percentage}
              <br />
              {value.downloaded}/{value.total}, {value.speed}/s, ETA:{' '}
              {value.ETA}s
            </div>
            <div className="flex-center aspect-9/12 w-full rounded-lg bg-bg-200 p-2 dark:bg-bg-800">
              <Icon icon="tabler:clock" className="size-16 text-bg-500" />
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-bg-500">
              {typeof categories !== 'string' &&
                (() => {
                  const category = categories.find(
                    category => category.id === value.metadata.category
                  )

                  return category !== undefined ? (
                    <>
                      <Icon
                        icon={category.icon}
                        className="size-4 text-bg-500"
                      />{' '}
                      {category.name}
                    </>
                  ) : (
                    ''
                  )
                })()}
            </div>
            <p className="mt-1 line-clamp-3 w-full min-w-0 text-xl font-medium">
              {value.metadata.title}{' '}
              {value.metadata.edition !== '' && (
                <span className="text-sm text-bg-500">
                  ({value.metadata.edition} ed)
                </span>
              )}
            </p>
            <div className="mt-0.5 line-clamp-3 break-all text-sm font-medium text-custom-500">
              {value.metadata.authors}
            </div>
            <div className="mt-auto w-full min-w-0">
              <BookMeta isGridView item={value.metadata} />
            </div>
          </li>
        ))}
        {books.map(item => (
          <EntryItem key={item.id} item={item} />
        ))}
      </ul>
    </Scrollbar>
  )
}

export default GridView
