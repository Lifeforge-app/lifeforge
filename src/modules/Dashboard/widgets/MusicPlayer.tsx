import { Icon } from '@iconify/react'
import React, { useRef } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@components/buttons'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import DashboardItem from '@components/utilities/DashboardItem'
import { useMusicContext } from '@providers/MusicProvider'
import ControlButtons from '../../Music/components/Bottombar/components/ControlButtons'

export default function MusicPlayer(): React.ReactElement {
  const { currentMusic, isPlaying } = useMusicContext()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <DashboardItem ref={ref} icon="tabler:music" title="Music Player">
      <div className="flex min-h-0 flex-1 flex-col">
        {currentMusic !== null ? (
          <>
            <div className="relative flex h-full min-h-0 flex-1 flex-col">
              <div className="absolute left-1/2 top-1/2 flex aspect-square h-full flex-1 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-bg-100 shadow-custom dark:bg-bg-800">
                <Icon
                  className={`aspect-square h-full w-1/2 ${
                    isPlaying ? 'animate-spin text-custom-500' : 'text-bg-500'
                  }`}
                  icon="tabler:disc"
                />
              </div>
            </div>
            <div className="my-4 flex flex-col items-center gap-1">
              <h2 className="line-clamp-2 text-center text-lg font-semibold">
                {currentMusic?.name}
              </h2>
              <p className="line-clamp-2 text-center text-bg-500">
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
                namespace="modules.music"
                onClick={() => {
                  navigate('/music')
                }}
              >
                select music
              </Button>
            }
            icon="tabler:disc-off"
            name="music"
            namespace="modules.dashboard"
            tKey="widgets.musicPlayer"
          />
        )}
      </div>
    </DashboardItem>
  )
}
