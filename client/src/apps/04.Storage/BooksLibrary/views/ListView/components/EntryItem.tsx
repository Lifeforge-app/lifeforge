import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ContextMenu, ItemWrapper } from 'lifeforge-ui'

import { type BooksLibraryEntry } from '../../../providers/BooksLibraryProvider'
import BookMeta from '../../components/BookMeta'
import EntryContextMenu from '../../components/EntryContextMenu'
import ReadStatusChip from '../../components/ReadStatusChip'

export default function EntryItem({ item }: { item: BooksLibraryEntry }) {
  const collectionsQuery = useQuery(
    forgeAPI.booksLibrary.collections.list.queryOptions()
  )

  return (
    <ItemWrapper
      key={item.id}
      as="li"
      className="flex flex-col gap-3 sm:flex-row"
    >
      <div className="absolute top-4 right-3 z-20 flex">
        <ContextMenu>
          <EntryContextMenu item={item} />
        </ContextMenu>
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
      <div className="flex-center component-bg-lighter relative isolate aspect-10/12 h-min w-[calc(100%-4rem)] rounded-lg p-2 sm:w-28">
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
      <div className="flex w-full min-w-0 flex-1 flex-col">
        <ReadStatusChip item={item} />
        {collectionsQuery.data && (
          <div className="text-bg-500 mb-1 flex items-center gap-1 text-sm font-medium">
            {(() => {
              const collection = collectionsQuery.data.find(
                collection => collection.id === item.collection
              )

              return collection !== undefined ? (
                <>
                  <Icon className="text-bg-500 size-4" icon={collection.icon} />
                  {collection.name}
                </>
              ) : (
                ''
              )
            })()}
          </div>
        )}
        <div className="line-clamp-3 text-lg font-semibold sm:mr-28">
          {item.title}{' '}
          {item.edition !== '' && (
            <span className="text-bg-500 text-sm">({item.edition} ed)</span>
          )}
        </div>
        <div className="text-custom-500 mt-1 text-sm font-medium sm:mr-28">
          {item.authors}
        </div>
        <BookMeta item={item} />
      </div>
    </ItemWrapper>
  )
}
