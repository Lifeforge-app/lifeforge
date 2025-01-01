import { Icon } from '@iconify/react'
import React from 'react'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
import { type IBooksLibraryEntry } from '@interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import EntryItem from './components/EntryItem'
import BookMeta from '../components/BookMeta'

function ListView({
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
      <ul className="space-y-4 px-4 pb-8">
        {Object.entries(processes).map(([key, value]) => (
          <li
            key={key}
            className="relative flex items-center gap-4 rounded-lg bg-bg-50 p-4 shadow-custom dark:bg-bg-900"
          >
            <div className="flex-center absolute left-0 top-0 size-full rounded-lg bg-bg-50/50 text-center font-medium dark:bg-bg-900/70">
              Downloading... {value.percentage}
              <br />
              {value.downloaded}/{value.total}, {value.speed}/s, ETA:{' '}
              {value.ETA}s
            </div>
            <div className="flex-center aspect-[9/12] w-20 rounded-lg bg-bg-200 p-2 dark:bg-bg-800">
              <Icon icon="tabler:clock" className="size-8 text-bg-500" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-1 text-sm font-medium text-bg-500">
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
              <div className="text-lg font-semibold">
                {value.metadata.title}{' '}
                {value.metadata.edition !== '' && (
                  <span className="text-sm text-bg-500">
                    ({value.metadata.edition} ed)
                  </span>
                )}
              </div>
              <div className="text-sm font-medium text-custom-500">
                {value.metadata.authors}
              </div>
              <BookMeta item={value.metadata} />
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

export default ListView
