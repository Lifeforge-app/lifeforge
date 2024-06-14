import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import { useMusicContext } from '@providers/MusicProvider'
import ControlButtons from '../../Music/components/Bottombar/components/ControlButtons'

export default function MusicPlayer(): React.ReactElement {
  const { t } = useTranslation()
  const { currentMusic, isPlaying } = useMusicContext()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      className="flex size-full flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900"
    >
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:music" className="text-2xl" />
        <span className="ml-2">{t('dashboard.widgets.musicPlayer.title')}</span>
      </h1>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
        {currentMusic !== null ? (
          <>
            <div className="flex aspect-square flex-1 items-center justify-center rounded-md bg-bg-800">
              <Icon
                icon="tabler:disc"
                className={`aspect-square h-full w-1/2 ${
                  isPlaying ? 'animate-spin text-custom-500' : ' text-bg-500'
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
          <>
            <Icon icon="tabler:disc-off" className="text-9xl text-bg-500" />
            <p className="mt-4 text-lg text-bg-500">
              {t('dashboard.widgets.musicPlayer.noMusicPlaying')}
            </p>
            <Button
              onClick={() => {
                navigate('/music')
              }}
              icon="tabler:music"
              className="mt-4"
            >
              select music
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
