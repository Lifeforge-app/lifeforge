import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { Button, DashboardItem, EmptyStateScreen } from 'lifeforge-ui'
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router'

import ControlButtons from '@apps/Music/components/Bottombar/components/ControlButtons'
import { useMusicContext } from '@apps/Music/providers/MusicProvider'

export default function MusicPlayer() {
  const { currentMusic, isPlaying } = useMusicContext()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <DashboardItem
      ref={ref}
      componentBesideTitle={
        <Button
          as={Link}
          className="p-2!"
          icon="tabler:chevron-right"
          to="/music"
          variant="plain"
        />
      }
      icon="tabler:music"
      title="Music Player"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {currentMusic !== null ? (
          <>
            <div className="shadow-custom component-bg-lighter flex w-full flex-1 items-center justify-center rounded-md">
              <Icon
                className={clsx(
                  'aspect-square h-full w-1/2',
                  isPlaying ? 'text-custom-500 animate-spin' : 'text-bg-500'
                )}
                icon="tabler:disc"
              />
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
