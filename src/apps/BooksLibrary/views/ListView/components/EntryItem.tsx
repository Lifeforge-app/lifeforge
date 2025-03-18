/* eslint-disable jsx-a11y/anchor-has-content */
import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { useState } from 'react'

import { fetchAPI } from '@lifeforge/core'
import { useComponentBg } from '@lifeforge/core'
import { Button, HamburgerMenu } from '@lifeforge/ui'

import { type IBooksLibraryEntry } from '../../../interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '../../../providers/BooksLibraryProvider'
import BookMeta from '../../components/BookMeta'
import EntryContextMenu from '../../components/EntryContextMenu'

export default function EntryItem({ item }: { item: IBooksLibraryEntry }) {
  const queryClient = useQueryClient()
  const { componentBgWithHover, componentBgLighter } = useComponentBg()
  const {
    categories: { data: categories }
  } = useBooksLibraryContext()

  const [addToFavouritesLoading, setAddToFavouritesLoading] = useState(false)

  async function addToFavourites() {
    setAddToFavouritesLoading(true)

    try {
      await fetchAPI<IBooksLibraryEntry>(
        `books-library/entries/favourite/${item.id}`,
        {
          method: 'POST'
        }
      )

      queryClient.setQueryData<IBooksLibraryEntry[]>(
        ['books-library', 'entries'],
        prevEntries => {
          if (!prevEntries) return []

          return prevEntries.map(entry => {
            if (entry.id === item.id) {
              return {
                ...entry,
                is_favourite: !entry.is_favourite
              }
            }

            return entry
          })
        }
      )
    } catch {
      console.error('Failed to add to favourites')
    } finally {
      setAddToFavouritesLoading(false)
    }
  }

  return (
    <li
      key={item.id}
      className={clsx(
        'shadow-custom relative flex gap-4 rounded-lg p-4 transition-all',
        componentBgWithHover
      )}
    >
      <div className="absolute right-3 top-4 z-20 flex">
        <Button
          className={clsx('p-2!', item.is_favourite && 'text-red-500!')}
          icon={(() => {
            if (addToFavouritesLoading) {
              return 'svg-spinners:180-ring'
            }

            return item.is_favourite ? 'tabler:heart-filled' : 'tabler:heart'
          })()}
          variant="plain"
          onClick={() => {
            addToFavourites().catch(console.error)
          }}
        />
        <HamburgerMenu>
          <EntryContextMenu item={item} />
        </HamburgerMenu>
      </div>
      <a
        className="absolute inset-0 z-10 size-full rounded-lg"
        href={`${import.meta.env.VITE_API_HOST}/media/${item.collectionId}/${
          item.id
        }/${item.file}`}
        rel="noreferrer"
        target="_blank"
      />
      <div
        className={clsx(
          'flex-center aspect-10/12 h-min w-24 rounded-lg p-2',
          componentBgLighter
        )}
      >
        <img
          alt=""
          className="h-full object-cover"
          src={`${import.meta.env.VITE_API_HOST}/media/${item.collectionId}/${
            item.id
          }/${item.thumbnail}`}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {typeof categories !== 'string' && (
          <div className="text-bg-500 flex items-center gap-1 text-sm font-medium">
            {(() => {
              const category = categories.find(
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
        )}
        <div className="mr-20 line-clamp-3 text-lg font-semibold">
          {item.title}{' '}
          {item.edition !== '' && (
            <span className="text-bg-500 text-sm">({item.edition} ed)</span>
          )}
        </div>
        <div className="text-custom-500 mr-20 text-sm font-medium">
          {item.authors}
        </div>
        <BookMeta item={item} />
      </div>
    </li>
  )
}
