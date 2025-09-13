import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ItemWrapper, Scrollbar } from 'lifeforge-ui'

import {
  type BooksLibraryEntry,
  useBooksLibraryContext
} from '../../providers/BooksLibraryProvider'
import BookMeta from '../components/BookMeta'
import EntryItem from './components/EntryItem'

function ListView({ books }: { books: BooksLibraryEntry[] }) {
  const collectionsQuery = useQuery(
    forgeAPI.booksLibrary.collections.list.queryOptions()
  )

  const {
    miscellaneous: { processes }
  } = useBooksLibraryContext()

  return (
    <Scrollbar className="mt-6">
      <ul className="space-y-3 px-4 pb-8">
        {Object.entries(processes).map(
          ([key, value]) =>
            value && (
              <ItemWrapper
                key={key}
                as="li"
                className="flex flex-col gap-3 sm:flex-row"
              >
                <div className="flex-center bg-bg-50/50 dark:bg-bg-900/70 absolute top-0 left-0 size-full rounded-lg text-center font-medium">
                  Downloading... {value.progress!.percentage}
                  <br />
                  {value.progress!.downloaded}/{value.progress!.total},{' '}
                  {value.progress!.speed}/s, ETA: {value.progress!.ETA}s
                </div>
                <div className="flex-center bg-bg-200 dark:bg-bg-800 aspect-9/12 w-20 rounded-lg p-2">
                  <Icon className="text-bg-500 size-8" icon="tabler:clock" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="text-bg-500 flex items-center gap-1 text-sm font-medium">
                    {collectionsQuery.data &&
                      (() => {
                        const category = collectionsQuery.data.find(
                          category => category.id === value.data!.category
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
                    {value.data!.title}{' '}
                    {value.data!.edition !== '' && (
                      <span className="text-bg-500 text-sm">
                        ({value.data!.edition} ed)
                      </span>
                    )}
                  </div>
                  <div className="text-custom-500 text-sm font-medium">
                    {value.data!.authors}
                  </div>
                  <BookMeta item={value.data!} />
                </div>
              </ItemWrapper>
            )
        )}
        {books.map(item => (
          <EntryItem key={item.id} item={item} />
        ))}
      </ul>
    </Scrollbar>
  )
}

export default ListView
