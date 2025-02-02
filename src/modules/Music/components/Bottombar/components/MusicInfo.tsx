import { Icon } from '@iconify/react'
import React from 'react'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import { useMusicContext } from '@providers/MusicProvider'

export default function MusicInfo(): React.ReactElement {
  const { currentMusic, isPlaying } = useMusicContext()

  if (currentMusic === null) {
    return <></>
  }

  return (
    <div className="flex-between flex w-full min-w-0 md:w-1/3">
      <div className="flex w-full min-w-0 items-center">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-custom-500/20">
          <Icon
            className={`${
              isPlaying ? 'animate-spin' : ''
            } text-3xl text-custom-500`}
            icon="tabler:disc"
          />
        </div>
        <div className="ml-4 w-full min-w-0">
          <p className="min-w-0 truncate font-semibold">{currentMusic.name}</p>
          <p className="text-sm text-bg-500">{currentMusic.author}</p>
        </div>
      </div>
      <HamburgerMenu className="relative md:hidden">sus</HamburgerMenu>
    </div>
  )
}
