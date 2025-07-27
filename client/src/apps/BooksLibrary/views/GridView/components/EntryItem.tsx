/* eslint-disable jsx-a11y/anchor-has-content */
import { Icon } from '@iconify/react'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import { HamburgerMenu } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import {
  type BooksLibraryEntry,
  useBooksLibraryContext
} from '../../../providers/BooksLibraryProvider'
import BookMeta from '../../components/BookMeta'
import EntryContextMenu from '../../components/EntryContextMenu'

function EntryItem({ item }: { item: BooksLibraryEntry }) {
  const { derivedThemeColor } = usePersonalization()

  const { collectionsQuery } = useBooksLibraryContext()

  const { t } = useTranslation('apps.booksLibrary')

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
      <div className="flex-center bg-bg-200/70 shadow-custom dark:bg-bg-800/50 relative isolate aspect-9/12 w-full overflow-hidden rounded-lg">
        <img
          alt=""
          className="h-full"
          src={
            forgeAPI.media.input({
              collectionId: item.collectionId,
              recordId: item.id,
              fieldId: item.thumbnail
            }).endpoint
          }
        />
        <Icon
          className="text-bg-200 dark:text-bg-800 absolute top-1/2 left-1/2 z-[-1] size-20 -translate-x-1/2 -translate-y-1/2"
          icon="tabler:book"
        />
      </div>
      <div className="mt-4">
        {item.is_read && (
          <span
            className={clsx(
              'bg-custom-500 mb-3 rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
              tinycolor(derivedThemeColor).isDark()
                ? 'text-bg-100'
                : 'text-bg-800'
            )}
          >
            {t('readLabel')}
          </span>
        )}
        {collectionsQuery.data &&
          (() => {
            const collection = collectionsQuery.data.find(
              collection => collection.id === item.collection
            )

            return collection !== undefined ? (
              <div className="text-bg-500 mt-2 flex items-center gap-1 text-sm font-medium">
                <Icon className="text-bg-500 size-4" icon={collection.icon} />{' '}
                {collection.name}
              </div>
            ) : (
              ''
            )
          })()}
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
      </div>
    </li>
  )
}

export default EntryItem
