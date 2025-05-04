import { Icon } from '@iconify/react'

import { Scrollbar } from '@lifeforge/ui'

import { type IBooksLibraryEntry } from '../../interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '../../providers/BooksLibraryProvider'
import BookMeta from '../components/BookMeta'
import EntryItem from './components/EntryItem'

function ListView({ books }: { books: IBooksLibraryEntry[] }) {
  const {
    miscellaneous: { processes },
    categoriesQuery
  } = useBooksLibraryContext()

  return (
    <Scrollbar className="mt-6">
      <ul className="space-y-4 px-4 pb-8">
        {Object.entries(processes).map(([key, value]) => (
          <li
            key={key}
            className="bg-bg-50 shadow-custom dark:bg-bg-900 relative flex items-center gap-4 rounded-lg p-4"
          >
            <div className="flex-center bg-bg-50/50 dark:bg-bg-900/70 absolute top-0 left-0 size-full rounded-lg text-center font-medium">
              Downloading... {value.percentage}
              <br />
              {value.downloaded}/{value.total}, {value.speed}/s, ETA:{' '}
              {value.ETA}s
            </div>
            <div className="flex-center bg-bg-200 dark:bg-bg-800 aspect-9/12 w-20 rounded-lg p-2">
              <Icon className="text-bg-500 size-8" icon="tabler:clock" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="text-bg-500 flex items-center gap-1 text-sm font-medium">
                {categoriesQuery.data &&
                  (() => {
                    const category = categoriesQuery.data.find(
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
              <div className="text-lg font-semibold">
                {value.metadata.title}{' '}
                {value.metadata.edition !== '' && (
                  <span className="text-bg-500 text-sm">
                    ({value.metadata.edition} ed)
                  </span>
                )}
              </div>
              <div className="text-custom-500 text-sm font-medium">
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
