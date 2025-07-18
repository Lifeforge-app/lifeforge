import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import { DeleteConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI, useAPIQuery } from 'shared/lib'
import {
  ISchemaWithPB,
  ScoresLibraryCollectionsSchemas
} from 'shared/types/collections'

import ModifyEntryModal from '@apps/ScoresLibrary/components/modals/ModifyEntryModal'

import AudioPlayer from '../../../components/AudioPlayer'
import DownloadMenu from '../../../components/DownloadMenu'

function EntryItem({
  entry
}: {
  entry: ISchemaWithPB<ScoresLibraryCollectionsSchemas.IEntry>
}) {
  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const typesQuery = useAPIQuery<
    ISchemaWithPB<ScoresLibraryCollectionsSchemas.ITypeAggregated>[]
  >(`scores-library/types`, ['scores-library', 'types'])

  const type = useMemo(() => {
    return typesQuery.data?.find(type => type.id === entry.type)
  }, [typesQuery.data, entry.type])

  async function favouriteTab() {
    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `scores-library/entries/favourite/${entry.id}`,
        {
          method: 'POST'
        }
      )

      queryClient.invalidateQueries({ queryKey: ['scores-library'] })
    } catch {
      toast.error('Failed to add to favourites')
    }
  }

  const handleUpdateEntry = useCallback(() => {
    open(ModifyEntryModal, {
      existedData: entry,
      queryKey: ['scores-library']
    })
  }, [entry])

  const handleDeleteEntry = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'scores-library/entries',
      confirmationText: 'Delete this guitar tab',
      data: entry,
      itemName: 'guitar tab',
      nameKey: 'name' as const,
      queryKey: ['scores-library']
    })
  }, [entry])

  return (
    <li
      key={entry.id}
      className="shadow-custom component-bg-with-hover relative rounded-lg transition-all"
    >
      <a
        key={entry.id}
        className="flex items-center justify-between gap-3 p-4"
        href={`${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
          entry.id
        }/${entry.pdf}`}
        rel="noreferrer"
        target="_blank"
      >
        <div className="flex w-full min-w-0 items-center gap-5">
          <div className="flex-center bg-bg-200 dark:bg-bg-800 w-16 overflow-hidden rounded-sm">
            <img
              alt=""
              className="h-full"
              src={`${import.meta.env.VITE_API_HOST}/media/${
                entry.collectionId
              }/${entry.id}/${entry.thumbnail}`}
            />
          </div>
          <div className="flex w-full min-w-0 flex-1 flex-col">
            {type && (
              <div className="mb-2 flex items-center gap-2">
                <Icon
                  className="text-bg-500 size-4 shrink-0"
                  icon={type.icon}
                />
                <span className="text-bg-500 truncate text-sm">
                  {type.name}
                </span>
              </div>
            )}
            <div className="flex w-full items-center gap-2">
              <h3 className="truncate text-lg font-semibold">{entry.name}</h3>
              {entry.isFavourite && (
                <Icon
                  className="size-4 shrink-0 text-yellow-500"
                  icon="tabler:star-filled"
                />
              )}
            </div>
            <div className="text-bg-500 flex w-full min-w-0 items-center gap-2 text-sm font-medium whitespace-nowrap">
              <p className="min-w-0 truncate">
                {entry.author !== '' ? entry.author : 'Unknown'}
              </p>
              <Icon className="size-1" icon="tabler:circle-filled" />
              <span>{entry.pageCount} pages</span>
            </div>
          </div>
        </div>
        {entry.audio && (
          <AudioPlayer
            url={`${import.meta.env.VITE_API_HOST}/media/${
              entry.collectionId
            }/${entry.id}/${entry.audio}`}
          />
        )}
        <DownloadMenu entry={entry} />
        <HamburgerMenu>
          <MenuItem
            icon={entry.isFavourite ? 'tabler:star-off' : 'tabler:star'}
            text={entry.isFavourite ? 'Unfavourite' : 'Favourite'}
            onClick={e => {
              e.preventDefault()
              favouriteTab()
            }}
          />
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={handleUpdateEntry}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={handleDeleteEntry}
          />
        </HamburgerMenu>
      </a>
    </li>
  )
}

export default EntryItem
