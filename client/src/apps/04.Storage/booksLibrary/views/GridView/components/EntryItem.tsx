import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ContextMenu, ItemWrapper } from 'lifeforge-ui'

import { type BooksLibraryEntry } from '../../../providers/BooksLibraryProvider'
import BookMeta from '../../components/BookMeta'
import EntryContextMenu from '../../components/EntryContextMenu'
import ReadStatusChip from '../../components/ReadStatusChip'

function EntryItem({ item }: { item: BooksLibraryEntry }) {
  const collectionsQuery = useQuery(
    forgeAPI.booksLibrary.collections.list.queryOptions()
  )

  return (
    <ItemWrapper key={item.id} as="li">
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
      <ContextMenu
        classNames={{
          wrapper: 'absolute right-6 top-6 z-20'
        }}
      >
        <EntryContextMenu item={item} />
      </ContextMenu>
      <div className="flex-center bg-bg-200/70 shadow-custom dark:bg-bg-800/50 relative isolate aspect-9/12 w-full overflow-hidden rounded-lg">
        <img
          alt=""
          className="h-full"
          loading="lazy"
          src={
            forgeAPI.media.input({
              collectionId: item.collectionId,
              recordId: item.id,
              fieldId: item.thumbnail,
              thumb: '200x0'
            }).endpoint
          }
        />
        <Icon
          className="text-bg-200 dark:text-bg-800 absolute top-1/2 left-1/2 z-[-1] size-20 -translate-x-1/2 -translate-y-1/2"
          icon="tabler:book"
        />
      </div>
      <div className="mt-6 w-full min-w-0">
        <ReadStatusChip item={item} />
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
    </ItemWrapper>
  )
}

export default EntryItem
