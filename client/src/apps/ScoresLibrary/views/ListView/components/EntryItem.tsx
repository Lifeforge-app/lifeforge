import { Icon } from '@iconify/react/dist/iconify.js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  ConfirmationModal,
  HamburgerMenu,
  MenuItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'

import type { ScoreLibraryEntry } from '@apps/ScoresLibrary'
import ModifyEntryModal from '@apps/ScoresLibrary/components/modals/ModifyEntryModal'

import AudioPlayer from '../../../components/AudioPlayer'
import DownloadMenu from '../../../components/DownloadMenu'

function EntryItem({ entry }: { entry: ScoreLibraryEntry }) {
  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const typesQuery = useQuery(forgeAPI.scoresLibrary.types.list.queryOptions())

  const type = useMemo(() => {
    return typesQuery.data?.find(type => type.id === entry.type)
  }, [typesQuery.data, entry.type])

  const toggleFavouriteStatusMutation = useMutation(
    forgeAPI.scoresLibrary.entries.toggleFavourite
      .input({
        id: entry.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['scoresLibrary'] })
        },
        onError: () => {
          toast.error('Failed to toggle favourite status')
        }
      })
  )

  const deleteMutation = useMutation(
    forgeAPI.scoresLibrary.entries.remove
      .input({
        id: entry.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['scoresLibrary'] })
        },
        onError: () => {
          toast.error('Failed to delete entry')
        }
      })
  )

  const handleUpdateEntry = useCallback(() => {
    open(ModifyEntryModal, {
      initialData: entry,
      queryKey: ['scores-library']
    })
  }, [entry])

  const handleDeleteEntry = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Entry',
      description: `Are you sure you want to delete this score for song "${entry.name}"?`,
      confirmationPrompt: entry.name,
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
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
              src={
                forgeAPI.media.input({
                  collectionId: entry.collectionId,
                  recordId: entry.id,
                  fieldId: entry.thumbnail,
                  thumb: '0x512'
                }).endpoint
              }
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
              toggleFavouriteStatusMutation.mutateAsync({})
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
