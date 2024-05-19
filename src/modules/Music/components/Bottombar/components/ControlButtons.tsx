import React from 'react'
import { toast } from 'react-toastify'
import { useMusicContext } from '@providers/MusicProvider'
import IconButton from './IconButton'

export default function ControlButtons(): React.ReactElement {
  const {
    currentMusic,
    isPlaying,
    isShuffle,
    isRepeat,
    setIsShuffle,
    setIsRepeat,
    togglePlay,
    nextMusic,
    lastMusic
  } = useMusicContext()

  if (currentMusic === null) {
    return <></>
  }

  return (
    <div className="flex w-1/3 items-center gap-2">
      <IconButton
        onClick={() => {
          setIsShuffle(!isShuffle)
          if (isShuffle) setIsRepeat(false)
        }}
        className={
          isShuffle
            ? 'text-custom-500 hover:text-custom-600'
            : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-100'
        }
        icon="uil:shuffle"
      />
      <IconButton
        onClick={lastMusic}
        className="text-bg-500 hover:text-bg-800 dark:hover:text-bg-100"
        icon="tabler:skip-back"
      />
      <IconButton
        onClick={() => {
          togglePlay(currentMusic).catch(err => {
            toast.error(`Failed to play music. Error: ${err}`)
          })
        }}
        className="mx-2 rounded-full bg-bg-500 p-4 text-white hover:!bg-custom-500 dark:bg-bg-100 dark:text-bg-800"
        icon={
          isPlaying ? 'tabler:player-pause-filled' : 'tabler:player-play-filled'
        }
      />
      <IconButton
        onClick={nextMusic}
        className="text-bg-500 hover:text-bg-800 dark:hover:text-bg-100"
        icon="tabler:skip-forward"
      />
      <IconButton
        onClick={() => {
          setIsRepeat(!isRepeat)
          if (isRepeat) setIsShuffle(false)
        }}
        className={
          isRepeat
            ? 'text-custom-500 hover:text-custom-600'
            : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-100'
        }
        icon="uil:repeat"
      />
    </div>
  )
}
