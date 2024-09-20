import { Icon } from '@iconify/react'
import React from 'react'
import { useMusicContext } from '@providers/MusicProvider'
import IconButton from './IconButton'

export default function VolumeControl(): React.ReactElement {
  const { audio, currentMusic, setVolume, volume, toggleFavourite } =
    useMusicContext()

  if (currentMusic === null) {
    return <></>
  }

  return (
    <div className="hidden w-1/3 items-center justify-end gap-2 xl:flex">
      <IconButton
        onClick={() => {
          toggleFavourite(currentMusic).catch(() => {})
        }}
        className={
          currentMusic.is_favourite
            ? 'text-red-500 hover:text-red-600'
            : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
        }
        icon={
          currentMusic.is_favourite ? 'tabler:heart-filled' : 'tabler:heart'
        }
      />
      <div className="flex items-center">
        <Icon icon="tabler:volume" className="mr-4 text-xl text-bg-500" />
        <input
          type="range"
          onChange={e => {
            audio.volume = +e.target.value / 100
            setVolume(+e.target.value)
          }}
          className="secondary h-1 w-32 cursor-pointer overflow-hidden rounded-full bg-bg-200 dark:bg-bg-700"
          value={volume}
          max="100"
        ></input>
      </div>
    </div>
  )
}
