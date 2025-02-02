/* eslint-disable jsx-a11y/anchor-has-content */
import { Icon } from '@iconify/react'
import React from 'react'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import { type IBooksLibraryEntry } from '@interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import BookMeta from '../../components/BookMeta'
import EntryContextMenu from '../../components/EntryContextMenu'

function EntryItem({ item }: { item: IBooksLibraryEntry }): React.ReactElement {
  const {
    categories: { data: categories }
  } = useBooksLibraryContext()

  return (
    <li
      key={item.id}
      className="relative flex w-full min-w-0 flex-col items-start rounded-lg bg-bg-50 p-4 transition-all hover:bg-bg-200/70 dark:bg-bg-900 dark:hover:bg-bg-800/50"
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
        className="absolute right-6 top-6 z-20"
        customTailwindColor="bg-bg-800/50 hover:bg-bg-700"
      >
        <EntryContextMenu item={item} />
      </HamburgerMenu>
      <div className="flex-center aspect-9/12 w-full overflow-hidden rounded-lg bg-bg-200/70 shadow-custom dark:bg-bg-800/50">
        <img
          alt=""
          className="h-full"
          src={`${import.meta.env.VITE_API_HOST}/media/${item.collectionId}/${
            item.id
          }/${item.thumbnail}`}
        />
      </div>
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-bg-500">
        {typeof categories !== 'string' &&
          (() => {
            const category = categories.find(
              category => category.id === item.category
            )

            return category !== undefined ? (
              <>
                <Icon className="size-4 text-bg-500" icon={category.icon} />{' '}
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
          <span className="text-sm text-bg-500">({item.edition} ed)</span>
        )}
      </div>
      <div className="mt-0.5 line-clamp-3 break-all text-sm font-medium text-custom-500">
        {item.authors}
      </div>
      <div className="mt-auto w-full min-w-0">
        <BookMeta isGridView item={item} />
      </div>
    </li>
  )
}

export default EntryItem
