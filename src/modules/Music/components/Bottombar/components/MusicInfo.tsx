import { Icon } from '@iconify/react'
import clsx from 'clsx'

import { HamburgerMenu } from '@lifeforge/ui'

import { useMusicContext } from '@modules/Music/providers/MusicProvider'

export default function MusicInfo() {
  const { currentMusic, isPlaying } = useMusicContext()

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
      <HamburgerMenu className="relative md:hidden">sus</HamburgerMenu>
    </div>
  )
}
