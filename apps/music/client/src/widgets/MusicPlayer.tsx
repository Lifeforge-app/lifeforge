import ControlButtons from '@/components/Bottombar/components/ControlButtons'
import { useMusicContext } from '@/providers/MusicProvider'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { Button, DashboardItem, EmptyStateScreen } from 'lifeforge-ui'
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import type { WidgetConfig } from 'shared'

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
            <div className="shadow-custom bg-bg-100/50 dark:bg-bg-800/50 flex min-h-0 w-full flex-1 items-center justify-center rounded-md py-8">
              <Icon
                className={clsx(
                  'aspect-square h-full w-1/2',
                  isPlaying
                    ? 'text-custom-500 animate-spin'
                    : 'text-bg-300 dark:text-bg-700'
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
            CTAButtonProps={{
              className: 'mt-4',
              icon: 'tabler:music',
              namespace: 'apps.music',
              onClick: () => {
                navigate('/music')
              },
              children: 'Select Music'
            }}
            icon="tabler:disc-off"
            name="music"
            namespace="apps.dashboard"
            tKey="widgets.musicPlayer"
          />
        )}
      </div>
    </DashboardItem>
  )
}

export const config: WidgetConfig = {
  namespace: 'apps.music',
  id: 'musicPlayer',
  icon: 'tabler:music',
  minW: 2,
  minH: 4
}
