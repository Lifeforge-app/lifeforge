import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import { ItemWrapper, Scrollbar } from 'lifeforge-ui'

import {
  type BooksLibraryEntry,
  useBooksLibraryContext
} from '../../providers/BooksLibraryProvider'
import BookMeta from '../components/BookMeta'
import EntryItem from './components/EntryItem'

function GridView({ books }: { books: BooksLibraryEntry[] }) {
  const collectionsQuery = useQuery(
    forgeAPI.booksLibrary.collections.list.queryOptions()
  )

  const {
    miscellaneous: { processes }
  } = useBooksLibraryContext()

  return (
    <Scrollbar>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2 px-4 pb-8 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] sm:gap-3">
        {Object.entries(processes).map(
          ([key, value]) =>
            value && (
              <ItemWrapper key={key} as="li">
                <div className="flex-center bg-bg-50/50 dark:bg-bg-900/70 absolute top-0 left-0 size-full rounded-lg p-8 text-center font-medium">
                  Downloading... {value.progress!.percentage}
                  <br />
                  {value.progress!.downloaded}/{value.progress!.total},{' '}
                  {value.progress!.speed}/s, ETA: {value.progress!.ETA}s
                </div>
                <div className="flex-center bg-bg-200 dark:bg-bg-800 aspect-9/12 w-full rounded-lg p-2">
                  <Icon className="text-bg-500 size-16" icon="tabler:clock" />
                </div>
                <div className="text-bg-500 mt-4 flex items-center gap-1 text-sm font-medium">
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
                <p className="mt-1 line-clamp-3 w-full min-w-0 text-xl font-medium">
                  {value.data!.title}{' '}
                  {value.data!.edition !== '' && (
                    <span className="text-bg-500 text-sm">
                      ({value.data!.edition} ed)
                    </span>
                  )}
                </p>
                <div className="text-custom-500 mt-0.5 line-clamp-3 text-sm font-medium break-all">
                  {value.data!.authors}
                </div>
                <div className="mt-auto w-full min-w-0">
                  <BookMeta isGridView item={value.data!} />
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

export default GridView
