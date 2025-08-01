/* eslint-disable jsx-a11y/anchor-has-content */
import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import { Button, HamburgerMenu } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import {
  type BooksLibraryEntry,
  useBooksLibraryContext
} from '../../../providers/BooksLibraryProvider'
import BookMeta from '../../components/BookMeta'
import EntryContextMenu from '../../components/EntryContextMenu'

export default function EntryItem({ item }: { item: BooksLibraryEntry }) {
  const { t } = useTranslation('apps.booksLibrary')

  const { derivedThemeColor } = usePersonalization()

  const queryClient = useQueryClient()

  const { collectionsQuery } = useBooksLibraryContext()

  const [addToFavouritesLoading, setAddToFavouritesLoading] = useState(false)

  const toggleFavouriteStatusMutation = useMutation(
    forgeAPI.booksLibrary.entries.toggleFavouriteStatus
      .input({
        id: item.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['booksLibrary', 'entries']
          })
        },
        onSettled: () => {
          setAddToFavouritesLoading(false)
        }
      })
  )

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
            toggleFavouriteStatusMutation.mutate({})
          }}
        />
        <HamburgerMenu>
          <EntryContextMenu item={item} />
        </HamburgerMenu>
      </div>
      <a
        className="absolute inset-0 z-10 size-full rounded-lg"
        href={
          forgeAPI.media.input({
            collectionId: item.collectionId,
            recordId: item.id,
            fieldId: item.file
          }).endpoint
        }
        rel="noreferrer"
        target="_blank"
      />
      <div className="flex-center component-bg-lighter relative isolate aspect-10/12 h-min w-28 rounded-lg p-2">
        <img
          alt=""
          className="h-full object-cover"
          src={
            forgeAPI.media.input({
              collectionId: item.collectionId,
              recordId: item.id,
              fieldId: item.thumbnail
            }).endpoint
          }
        />
        <Icon
          className="text-bg-200 dark:text-bg-800 absolute top-1/2 left-1/2 z-[-1] size-12 -translate-x-1/2 -translate-y-1/2"
          icon="tabler:book"
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
