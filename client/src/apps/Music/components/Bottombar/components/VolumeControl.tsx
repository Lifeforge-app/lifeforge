/* eslint-disable react-compiler/react-compiler */
import { Icon } from '@iconify/react'

import { useMusicContext } from '@apps/Music/providers/MusicProvider'

import IconButton from './IconButton'

export default function VolumeControl() {
  const { audio, currentMusic, setVolume, volume, toggleFavourite } =
    useMusicContext()

  if (currentMusic === null) {
    return <></>
  }

  return (
    <div className="hidden w-1/3 items-center justify-end gap-2 xl:flex">
      <IconButton
        className={
          currentMusic.is_favourite
            ? 'text-red-500 hover:text-red-600'
            : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
        }
        icon={
          currentMusic.is_favourite ? 'tabler:heart-filled' : 'tabler:heart'
        }
        onClick={() => {
          toggleFavourite(currentMusic).catch(() => {})
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
            audio.volume = +e.target.value / 100
            setVolume(+e.target.value)
          }}
        ></input>
      </div>
    </div>
  )
}
