import { useMusicContext } from '@/providers/MusicProvider'
import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from 'lifeforge-ui'
import { toast } from 'react-toastify'

export default function VolumeControl() {
  const queryClient = useQueryClient()

  const { audio, currentMusic, setCurrentMusic, setVolume, volume } =
    useMusicContext()

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
    <div className="hidden w-1/3 items-center justify-end gap-2 xl:flex">
      <Button
        className={
          currentMusic.is_favourite
            ? 'text-red-500 hover:text-red-600'
            : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
        }
        icon={
          currentMusic.is_favourite ? 'tabler:heart-filled' : 'tabler:heart'
        }
        variant="plain"
        onClick={() => {
          toggleFavouriteMutation.mutateAsync({})
        }}
      />
      <div className="flex items-center">
        <Icon className="text-bg-500 mr-4 text-xl" icon="tabler:volume" />
        <input
          className="secondary bg-bg-200 dark:bg-bg-700 h-1 w-32 cursor-pointer overflow-hidden rounded-full"
          max="100"
          type="range"
          value={volume}
          onChange={e => {
            audio.current.volume = +e.target.value / 100
            setVolume(+e.target.value)
          }}
        ></input>
      </div>
    </div>
  )
}
