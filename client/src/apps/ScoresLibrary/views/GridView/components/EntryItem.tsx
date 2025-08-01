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
  const queryClient = useQueryClient()

  const typesQuery = useQuery(forgeAPI.scoresLibrary.types.list.queryOptions())

  const type = useMemo(() => {
    return typesQuery.data?.find(type => type.id === entry.type)
  }, [typesQuery.data, entry.type])

  const open = useModalStore(state => state.open)

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
    <a
      key={entry.id}
      className="shadow-custom component-bg-with-hover block rounded-lg p-4 transition-all"
      href={
        forgeAPI.media.input({
          collectionId: entry.collectionId,
          recordId: entry.id,
          fieldId: entry.pdf
        }).endpoint
      }
      rel="noreferrer"
      target="_blank"
    >
      <div className="relative">
        <div className="flex-center bg-bg-100 dark:bg-bg-800 relative aspect-[1/1.4142] w-full overflow-hidden rounded-md">
          <Icon
            className="text-bg-300 dark:text-bg-700 absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2"
            icon="tabler:file-music"
          />
          <img
            key={entry.id}
            alt=""
            className="relative h-full object-cover object-top"
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
        <div className="bg-bg-500/80 absolute right-0 bottom-0 rounded-tl-md rounded-br-md p-1 px-2">
          <p className="text-xs text-white">{entry.pageCount} pages</p>
        </div>
        <HamburgerMenu
          classNames={{
            wrapper: 'absolute right-2 top-2 shrink-0'
          }}
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <MenuItem
            icon={entry.isFavourite ? 'tabler:star-off' : 'tabler:star'}
            text={entry.isFavourite ? 'Unfavourite' : 'Favourite'}
            onClick={() => {
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
      </div>
      <div className="mt-4 flex w-full min-w-0 items-center justify-between gap-8">
        <div className="w-full min-w-0">
          {type && (
            <div className="mb-2 flex items-center gap-2">
              <Icon className="text-bg-500 size-4 shrink-0" icon={type.icon} />
              <span className="text-bg-500 truncate text-sm">{type.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-medium">{entry.name}</h3>

            {entry.isFavourite && (
              <Icon
                className="size-4 shrink-0 text-yellow-500"
                icon="tabler:star-filled"
              />
            )}
          </div>
          <p className="text-custom-500 mt-1 truncate text-sm">
            {entry.author || 'Unknown'}
          </p>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <DownloadMenu entry={entry} />
          {entry.audio && (
            <AudioPlayer
              url={`${import.meta.env.VITE_API_HOST}/media/${
                entry.collectionId
              }/${entry.id}/${entry.audio}`}
            />
          )}
        </div>
      </div>
    </a>
  )
}

export default EntryItem
