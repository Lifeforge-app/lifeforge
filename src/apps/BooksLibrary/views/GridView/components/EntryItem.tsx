/* eslint-disable jsx-a11y/anchor-has-content */
import { Icon } from '@iconify/react'

import { HamburgerMenu } from '@lifeforge/ui'

import { type IBooksLibraryEntry } from '../../../interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '../../../providers/BooksLibraryProvider'
import BookMeta from '../../components/BookMeta'
import EntryContextMenu from '../../components/EntryContextMenu'

function EntryItem({ item }: { item: IBooksLibraryEntry }) {
  const {
    categories: { dataQuery: categoriesQuery }
  } = useBooksLibraryContext()

  return (
    <li
      key={item.id}
      className="bg-bg-50 hover:bg-bg-200/70 dark:bg-bg-900 dark:hover:bg-bg-800/50 relative flex w-full min-w-0 flex-col items-start rounded-lg p-4 transition-all"
    >
      <a
        className="absolute inset-0 z-10 size-full rounded-lg"
        href={`${import.meta.env.VITE_API_HOST}/media/${item.collectionId}/${
          item.id
        }/${item.file}`}
        rel="noreferrer"
        target="_blank"
      />
      <HamburgerMenu
        classNames={{
          wrapper: 'absolute right-6 top-6 z-20'
        }}
      >
        <EntryContextMenu item={item} />
      </HamburgerMenu>
      <div className="flex-center bg-bg-200/70 shadow-custom dark:bg-bg-800/50 aspect-9/12 w-full overflow-hidden rounded-lg">
        <img
          alt=""
          className="h-full"
          src={`${import.meta.env.VITE_API_HOST}/media/${item.collectionId}/${
            item.id
          }/${item.thumbnail}`}
        />
      </div>
      <div className="text-bg-500 mt-4 flex items-center gap-1 text-sm font-medium">
        {categoriesQuery.data &&
          (() => {
            const category = categoriesQuery.data.find(
              category => category.id === item.category
            )

            return category !== undefined ? (
              <>
                <Icon className="text-bg-500 size-4" icon={category.icon} />{' '}
                {category.name}
              </>
            ) : (
              ''
            )
          })()}
      </div>
      <div className="mt-1 line-clamp-3 w-full min-w-0 text-xl font-medium">
        {item.title}{' '}
        {item.edition !== '' && (
          <span className="text-bg-500 text-sm">({item.edition} ed)</span>
        )}
      </div>
      <div className="text-custom-500 mt-0.5 line-clamp-3 text-sm font-medium break-all">
        {item.authors}
      </div>
      <div className="mt-auto w-full min-w-0">
        <BookMeta isGridView item={item} />
      </div>
    </li>
  )
}

export default EntryItem
