import { type MusicEntry, useMusicContext } from '@/providers/MusicProvider'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useMemo } from 'react'
import { toast } from 'react-toastify'

function PlayStateIndicator({ music }: { music: MusicEntry }) {
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
      className={clsx('rounded-lg p-4 transition-all', stateClassName)}
      onClick={() => {
        togglePlay(music).catch(err => {
          toast.error(`Failed to play music. Error: ${err}`)
        })
      }}
    >
      <Icon className="text-xl" icon={stateIcon} />
    </button>
  )
}

export default PlayStateIndicator
