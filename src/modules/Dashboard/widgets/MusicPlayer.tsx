import { Icon } from '@iconify/react'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import DashboardItem from '@components/Miscellaneous/DashboardItem'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { useMusicContext } from '@providers/MusicProvider'
import ControlButtons from '../../Music/components/Bottombar/components/ControlButtons'

export default function MusicPlayer(): React.ReactElement {
  const { t } = useTranslation()
  const { currentMusic, isPlaying } = useMusicContext()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <DashboardItem
      ref={ref}
      icon="tabler:music"
      title={t('dashboard.widgets.musicPlayer.title')}
    >
      {currentMusic !== null ? (
        <>
          <div className="flex aspect-square flex-1 items-center justify-center rounded-md bg-bg-100 shadow-custom dark:bg-bg-800">
            <Icon
              icon="tabler:disc"
              className={`aspect-square h-full w-1/2 ${
                isPlaying ? 'animate-spin text-custom-500' : 'text-bg-500'
              }`}
            />
          </div>
          <div className="mb-4 flex flex-col items-center gap-1">
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
          title={t('dashboard.widgets.musicPlayer.noMusicPlaying')}
          icon="tabler:disc-off"
          customCTAButton={
            <Button
              onClick={() => {
                navigate('/music')
              }}
              icon="tabler:music"
              className="mt-4"
            >
              select music
            </Button>
          }
        />
      )}
    </DashboardItem>
  )
}
