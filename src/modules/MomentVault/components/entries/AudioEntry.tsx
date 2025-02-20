import WavesurferPlayer from '@wavesurfer/react'
import React, { useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { Button } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
import { IMomentVaultEntry } from '@interfaces/moment_vault_interfaces'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'

function AudioEntry({
  entry
}: {
  entry: IMomentVaultEntry
}): React.ReactElement {
  const { theme, bgTemp } = useThemeColors()
  const { theme: lightOrDarkTheme } = usePersonalizationContext()

  const { componentBg } = useThemeColors()
  const [totalTime, setTotalTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const onReady = (ws: WaveSurfer) => {
    setWavesurfer(ws)
    setTotalTime(ws.getDuration())
    setIsPlaying(false)

    ws.on('timeupdate', () => {
      setCurrentTime(ws.getCurrentTime())
    })
  }

  const onPlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause()
    }
  }

  return (
    <div className={`w-full ${componentBg} rounded-md shadow-custom p-4`}>
      <div className="flex items-center gap-4">
        <Button
          className="mb-6 sm:mb-0"
          icon={isPlaying ? 'tabler:pause' : 'tabler:play'}
          onClick={onPlayPause}
        />
        <div className="flex w-full items-center *:first:w-full sm:flex-row gap-2 sm:gap-4 flex-col">
          <WavesurferPlayer
            barGap={2}
            barRadius={100}
            barWidth={3}
            cursorColor={theme}
            height={50}
            progressColor={theme}
            url={`${import.meta.env.VITE_API_HOST}/media/${entry.file}`}
            waveColor={
              (lightOrDarkTheme === 'system' &&
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches) ||
              lightOrDarkTheme === 'dark'
                ? bgTemp[700]
                : bgTemp[400]
            }
            width="100%"
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onReady={onReady}
          />
          <p className="text-sm text-bg-500 whitespace-nowrap text-left w-full sm:w-auto">
            {currentTime.toFixed(2)} / {totalTime.toFixed(2)}
          </p>
        </div>
        <HamburgerMenu>
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={() => {}}
          />
        </HamburgerMenu>
      </div>
      {entry.transcription && (
        <div className="mt-6 border-l-4 border-custom-500 pl-4">
          <p className="text-bg-500">{entry.transcription}</p>
        </div>
      )}
    </div>
  )
}

export default AudioEntry
