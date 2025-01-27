import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useMemo } from 'react'
import { toast } from 'react-toastify'
import { IMusicEntry } from '@interfaces/music_interfaces'
import { useMusicContext } from '@providers/MusicProvider'

function PlayStateIndicator({
  music
}: {
  music: IMusicEntry
}): React.ReactElement {
  const { currentMusic, isPlaying, togglePlay } = useMusicContext()

  const stateIcon = useMemo(() => {
    if (currentMusic?.id === music.id) {
      return isPlaying ? 'tabler:disc' : 'tabler:pause'
    }

    return 'tabler:play'
  }, [currentMusic, isPlaying])

  const stateClassName = useMemo(() => {
    if (currentMusic?.id === music.id) {
      return isPlaying
        ? 'animate-spin text-custom-500'
        : 'text-bg-800 dark:text-bg-50'
    }

    return 'text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-50'
  }, [currentMusic, isPlaying])

  return (
    <button
      onClick={() => {
        togglePlay(music).catch(err => {
          toast.error(`Failed to play music. Error: ${err}`)
        })
      }}
      className={`rounded-lg p-4 transition-all ${stateClassName}`}
    >
      <Icon icon={stateIcon} className="text-xl" />
    </button>
  )
}

export default PlayStateIndicator