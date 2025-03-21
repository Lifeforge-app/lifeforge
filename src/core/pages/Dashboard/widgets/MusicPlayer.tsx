/* eslint-disable react-compiler/react-compiler */
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useRef } from 'react'
import { useNavigate } from 'react-router'

import { Button, DashboardItem, EmptyStateScreen } from '@lifeforge/ui'

import ControlButtons from '@apps/Music/components/Bottombar/components/ControlButtons'
import { useMusicContext } from '@apps/Music/providers/MusicProvider'

export default function MusicPlayer() {
  const { currentMusic, isPlaying } = useMusicContext()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <DashboardItem ref={ref} icon="tabler:music" title="Music Player">
      <div className="flex min-h-0 flex-1 flex-col">
        {currentMusic !== null ? (
          <>
            <div className="relative flex h-full min-h-0 flex-1 flex-col">
              <div className="bg-bg-100 shadow-custom dark:bg-bg-800 absolute top-1/2 left-1/2 flex aspect-square h-full flex-1 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md">
                <Icon
                  className={clsx(
                    'aspect-square h-full w-1/2',
                    isPlaying ? 'text-custom-500 animate-spin' : 'text-bg-500'
                  )}
                  icon="tabler:disc"
                />
              </div>
            </div>
            <div className="my-4 flex flex-col items-center gap-1">
              <h2 className="line-clamp-2 text-center text-lg font-semibold">
                {currentMusic?.name}
              </h2>
              <p className="text-bg-500 line-clamp-2 text-center">
                {currentMusic?.author}
              </p>
            </div>
            <ControlButtons
              isWidget
              isFull={(ref.current?.getBoundingClientRect().width ?? 0) > 300}
            />
          </>
        ) : (
          <EmptyStateScreen
            smaller
            customCTAButton={
              <Button
                className="mt-4"
                icon="tabler:music"
                namespace="apps.music"
                onClick={() => {
                  navigate('/music')
                }}
              >
                select music
              </Button>
            }
            icon="tabler:disc-off"
            name="music"
            namespace="core.dashboard"
            tKey="widgets.musicPlayer"
          />
        )}
      </div>
    </DashboardItem>
  )
}
