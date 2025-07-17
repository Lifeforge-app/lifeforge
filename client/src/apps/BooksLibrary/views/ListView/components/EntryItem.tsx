/* eslint-disable jsx-a11y/anchor-has-content */
import { Icon } from '@iconify/react'
import { usePersonalization } from '@providers/PersonalizationProvider'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import tinycolor from 'tinycolor2'

import { Button, HamburgerMenu } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { type IBooksLibraryEntry } from '../../../interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '../../../providers/BooksLibraryProvider'
import BookMeta from '../../components/BookMeta'
import EntryContextMenu from '../../components/EntryContextMenu'

export default function EntryItem({ item }: { item: IBooksLibraryEntry }) {
  const { t } = useTranslation('apps.booksLibrary')
  const { derivedThemeColor } = usePersonalization()
  const queryClient = useQueryClient()

  const { collectionsQuery } = useBooksLibraryContext()

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
      className="shadow-custom component-bg-with-hover relative flex gap-4 rounded-lg p-4"
    >
      <div className="absolute top-4 right-3 z-20 flex">
        <Button
          className={clsx(
            'aspect-square size-12',
            item.is_favourite && 'text-red-500!'
          )}
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
      <div className="flex-center component-bg-lighter aspect-10/12 h-min w-28 rounded-lg p-2">
        <img
          alt=""
          className="h-full object-cover"
          src={`${import.meta.env.VITE_API_HOST}/media/${item.collectionId}/${
            item.id
          }/${item.thumbnail}`}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        {item.is_read && (
          <span
            className={clsx(
              'bg-custom-500 mb-2 flex w-min items-center gap-1 rounded-full py-1 pr-3 pl-2.5 text-xs font-semibold tracking-wide whitespace-nowrap',
              tinycolor(derivedThemeColor).isDark()
                ? 'text-bg-100'
                : 'text-bg-800'
            )}
            data-tooltip-id={`read-label-${item.id}`}
          >
            <Icon className="size-4" icon="tabler:check" />
            {t('readLabel')}
          </span>
        )}
        {collectionsQuery.data && (
          <div className="text-bg-500 mb-1 flex items-center gap-1 text-sm font-medium">
            {(() => {
              const collection = collectionsQuery.data.find(
                collection => collection.id === item.collection
              )

              return collection !== undefined ? (
                <>
                  <Icon className="text-bg-500 size-4" icon={collection.icon} />{' '}
                  {collection.name}
                </>
              ) : (
                ''
              )
            })()}
          </div>
        )}
        <div className="mr-24 line-clamp-3 text-lg font-semibold">
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
