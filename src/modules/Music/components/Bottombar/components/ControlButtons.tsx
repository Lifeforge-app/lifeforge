import React from 'react'
import { toast } from 'react-toastify'
import { useMusicContext } from '@providers/MusicProvider'
import IconButton from './IconButton'

export default function ControlButtons({
  isWidget = false,
  isFull = false
}: {
  isWidget?: boolean
  isFull?: boolean
}): React.ReactElement {
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
    <div className={`flex-center gap-2 ${!isWidget ? 'xl:w-1/3' : ''}`}>
      {(isFull || !isWidget) && (
        <IconButton
          className={
            isShuffle
              ? 'text-custom-500 hover:text-custom-600'
              : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
          }
          icon="uil:shuffle"
          onClick={() => {
            setIsShuffle(!isShuffle)
            if (isShuffle) setIsRepeat(false)
          }}
        />
      )}
      <IconButton
        className="text-bg-500 hover:text-bg-800 dark:hover:text-bg-50"
        icon="tabler:skip-back"
        onClick={lastMusic}
      />
      <IconButton
        className="mx-2 rounded-full bg-bg-500 p-4 text-white shadow-custom hover:bg-custom-500! dark:bg-bg-100 dark:text-bg-800"
        icon={
          isPlaying ? 'tabler:player-pause-filled' : 'tabler:player-play-filled'
        }
        onClick={() => {
          togglePlay(currentMusic).catch(err => {
            toast.error(`Failed to play music. Error: ${err}`)
          })
        }}
      />
      <IconButton
        className="text-bg-500 hover:text-bg-800 dark:hover:text-bg-50"
        icon="tabler:skip-forward"
        onClick={nextMusic}
      />
      {(isFull || !isWidget) && (
        <IconButton
          className={
            isRepeat
              ? 'text-custom-500 hover:text-custom-600'
              : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
          }
          icon="uil:repeat"
          onClick={() => {
            setIsRepeat(!isRepeat)
            if (isRepeat) setIsShuffle(false)
          }}
        />
      )}
    </div>
  )
}
