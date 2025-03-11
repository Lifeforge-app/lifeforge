import { Icon } from '@iconify/react'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import React from 'react'

import { Scrollbar } from '@lifeforge/ui'

import { type IBooksLibraryEntry } from '@interfaces/books_library_interfaces'

import BookMeta from '../components/BookMeta'
import EntryItem from './components/EntryItem'

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
            className="bg-bg-50 dark:bg-bg-900 relative flex w-full min-w-0 flex-col items-start rounded-lg p-4 transition-all"
          >
            <div className="flex-center bg-bg-50/50 dark:bg-bg-900/70 absolute left-0 top-0 size-full rounded-lg p-8 text-center font-medium">
              Downloading... {value.percentage}
              <br />
              {value.downloaded}/{value.total}, {value.speed}/s, ETA:{' '}
              {value.ETA}s
            </div>
            <div className="flex-center bg-bg-200 dark:bg-bg-800 aspect-9/12 w-full rounded-lg p-2">
              <Icon className="text-bg-500 size-16" icon="tabler:clock" />
            </div>
            <div className="text-bg-500 mt-4 flex items-center gap-1 text-sm font-medium">
              {typeof categories !== 'string' &&
                (() => {
                  const category = categories.find(
                    category => category.id === value.metadata.category
                  )

                  return category !== undefined ? (
                    <>
                      <Icon
                        className="text-bg-500 size-4"
                        icon={category.icon}
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
                <span className="text-bg-500 text-sm">
                  ({value.metadata.edition} ed)
                </span>
              )}
            </p>
            <div className="text-custom-500 mt-0.5 line-clamp-3 break-all text-sm font-medium">
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
