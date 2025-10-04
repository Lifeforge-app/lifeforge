import { useMusicContext } from '@/providers/MusicProvider'
import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { Button } from 'lifeforge-ui'
import { toast } from 'react-toastify'

export default function MusicInfo() {
  const queryClient = useQueryClient()

  const { currentMusic, setCurrentMusic, isPlaying } = useMusicContext()

  const toggleFavouriteMutation = useMutation(
    forgeAPI.music.entries.toggleFavourite
      .input({
        id: currentMusic?.id || ''
      })
      .mutationOptions({
        onSuccess: () => {
          if (!currentMusic) return
          queryClient.invalidateQueries({
            queryKey: ['music', 'entries']
          })
          setCurrentMusic(prev => {
            if (!prev) return null

            return { ...prev, is_favourite: !prev.is_favourite }
          })
          toast.success(
            currentMusic.is_favourite
              ? `Removed "${currentMusic.name}" from favourites`
              : `Added "${currentMusic.name}" to favourites`
          )
        },
        onError: error => {
          toast.error(`Failed to toggle favourite: ${error.message}`)
        }
      })
  )

  if (currentMusic === null) {
    return <></>
  }

  return (
    <div className="flex-between flex w-full min-w-0 md:w-1/3">
      <div className="flex w-full min-w-0 items-center">
        <div className="bg-custom-500/20 flex size-12 shrink-0 items-center justify-center rounded-md">
          <Icon
            className={clsx(
              'text-custom-500 text-3xl',
              isPlaying && 'animate-spin'
            )}
            icon="tabler:disc"
          />
        </div>
        <div className="ml-4 w-full min-w-0">
          <p className="min-w-0 truncate font-semibold">{currentMusic.name}</p>
          <p className="text-bg-500 text-sm">{currentMusic.author}</p>
        </div>
      </div>
      <Button
        className={clsx(
          'md:hidden',
          currentMusic.is_favourite
            ? 'text-red-500 hover:text-red-600'
            : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
        )}
        icon={
          currentMusic.is_favourite ? 'tabler:heart-filled' : 'tabler:heart'
        }
        variant="plain"
        onClick={() => {
          toggleFavouriteMutation.mutateAsync({})
        }}
      />
    </div>
  )
}
