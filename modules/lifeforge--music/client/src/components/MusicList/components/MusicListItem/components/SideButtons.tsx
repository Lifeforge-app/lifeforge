import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { useCallback } from 'react'

import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Icon,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { type MusicEntry, useMusicContext } from '@/providers/MusicProvider'

import UpdateMusicModal from '../../../../modals/UpdateMusicModal'

function SideButtons({ music }: { music: MusicEntry }) {
  const queryClient = useQueryClient()
  const { stopMusic, currentMusic } = useMusicContext()
  const { open } = useModalStore()

  const toggleFavouriteMutation = useMutation(
    forgeAPI.entries.toggleFavourite
      .input({
        id: music.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['music', 'entries']
          })
          toast.success(
            music.is_favourite
              ? `Removed "${music.name}" from favourites`
              : `Added "${music.name}" to favourites`
          )
        },
        onError: error => {
          toast.error(`Failed to toggle favourite: ${error.message}`)
        }
      })
  )

  const handleUpdateEntry = useCallback(() => {
    open(UpdateMusicModal, {
      initialData: music
    })
  }, [music])

  const deleteEntryMutation = useMutation(
    forgeAPI.entries.remove
      .input({
        id: music.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['music', 'entries']
          })

          if (currentMusic?.id === music.id) {
            stopMusic()
          }
        },
        onError: error => {
          toast.error(`Failed to delete music: ${error.message}`)
        }
      })
  )

  const handleDeleteEntry = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Music',
      description: `Are you sure you want to delete "${music.name}"?`,
      onConfirm: async () => {
        await deleteEntryMutation.mutateAsync(undefined)
      }
    })
  }, [music])

  return (
    <div className="flex w-auto min-w-0 shrink-0 items-center justify-end sm:w-2/12">
      <button
        className={clsx(
          'hover:bg-bg-100 dark:hover:bg-bg-800/50 rounded-lg p-4 transition-all',
          music.is_favourite
            ? 'text-red-500 hover:text-red-600'
            : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
        )}
        onClick={() => {
          toggleFavouriteMutation.mutateAsync(undefined)
        }}
      >
        <Icon
          className="text-xl"
          icon={!music.is_favourite ? 'tabler:heart' : 'tabler:heart-filled'}
        />
      </button>
      <ContextMenu>
        <ContextMenuItem
          icon="tabler:download"
          label="Download"
          onClick={() => {
            const a = document.createElement('a')

            a.href = forgeAPI.getMedia({
              collectionId: music.collectionId,
              recordId: music.id,
              fieldId: music.file
            })
            a.download = music.name
            a.click()
          }}
        />
        <ContextMenuItem
          icon="tabler:pencil"
          label="Edit"
          onClick={handleUpdateEntry}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={handleDeleteEntry}
        />
      </ContextMenu>
    </div>
  )
}

export default SideButtons
