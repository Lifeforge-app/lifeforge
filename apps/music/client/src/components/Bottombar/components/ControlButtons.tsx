import { useMusicContext } from '@/providers/MusicProvider'
import clsx from 'clsx'
import { Button } from 'lifeforge-ui'
import { toast } from 'react-toastify'

export default function ControlButtons({
  isWidget = false,
  isFull = false
}: {
  isWidget?: boolean
  isFull?: boolean
}) {
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
    <div className={clsx('flex-center gap-2', !isWidget && 'xl:w-1/3')}>
      {(isFull || !isWidget) && (
        <Button
          icon="uil:shuffle"
          variant={isShuffle ? 'tertiary' : 'plain'}
          onClick={() => {
            setIsShuffle(!isShuffle)
            if (!isShuffle) setIsRepeat(false)
          }}
        />
      )}
      <Button icon="tabler:skip-back" variant="plain" onClick={lastMusic} />
      <Button
        icon={
          isPlaying ? 'tabler:player-pause-filled' : 'tabler:player-play-filled'
        }
        variant={!isPlaying ? 'primary' : 'plain'}
        onClick={() => {
          togglePlay(currentMusic).catch(err => {
            toast.error(`Failed to play music. Error: ${err}`)
          })
        }}
      />
      <Button icon="tabler:skip-forward" variant="plain" onClick={nextMusic} />
      {(isFull || !isWidget) && (
        <Button
          icon="uil:repeat"
          variant={isRepeat ? 'tertiary' : 'plain'}
          onClick={() => {
            setIsRepeat(!isRepeat)
            if (!isRepeat) setIsShuffle(false)
          }}
        />
      )}
    </div>
  )
}
