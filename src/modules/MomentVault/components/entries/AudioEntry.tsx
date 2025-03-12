/* eslint-disable import/named */
import { Icon } from '@iconify/react'
import { usePersonalization } from '@providers/PersonalizationProvider'
import WavesurferPlayer from '@wavesurfer/react'
import clsx from 'clsx'
import moment from 'moment'
import { ListResult } from 'pocketbase'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import WaveSurfer from 'wavesurfer.js'

import { Button, HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { IMomentVaultEntry } from '@modules/MomentVault/interfaces/moment_vault_interfaces'

import useComponentBg from '@hooks/useComponentBg'

import fetchAPI from '@utils/fetchAPI'

import { Loadable } from '../../../../core/interfaces/common'

function AudioEntry({
  entry,
  setData,
  onDelete,
  addEntryModalOpenType
}: {
  entry: IMomentVaultEntry
  setData: React.Dispatch<
    React.SetStateAction<Loadable<ListResult<IMomentVaultEntry>>>
  >
  onDelete: (data: IMomentVaultEntry) => void
  addEntryModalOpenType: 'text' | 'audio' | 'photo' | 'video' | null
}) {
  const {
    theme: lightOrDarkTheme,
    bgTempPalette,
    themeColor
  } = usePersonalization()

  const { componentBg } = useComponentBg()
  const [totalTime, setTotalTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcriptionLoading, setTranscriptionLoading] = useState(false)

  const onReady = (ws: any) => {
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

  async function addTranscription() {
    setTranscriptionLoading(true)

    try {
      const data = await fetchAPI<string>(
        `moment-vault/transcribe-existed/${entry.id}`,
        {
          method: 'POST'
        }
      )

      setData(prev => {
        if (typeof prev === 'string') {
          return prev
        }

        const newData = prev.items.map(item => {
          if (item.id === entry.id) {
            return {
              ...item,
              transcription: data
            }
          }
          return item
        })
        return {
          ...prev,
          items: newData
        }
      })
    } catch {
      toast.error('Failed to transcribe audio')
    } finally {
      setTranscriptionLoading(false)
    }
  }

  useEffect(() => {
    const el = document.getElementById(`audio-entry-${entry.id}`)
    if (el) {
      el.style.willChange = 'opacity, transform'
      el.getBoundingClientRect()
    }
  }, [addEntryModalOpenType])

  return (
    <div
      className={clsx('shadow-custom w-full rounded-md p-4', componentBg)}
      id={`audio-entry-${entry.id}`}
    >
      <div className="flex items-center gap-4">
        <Button
          className="mb-6 sm:mb-0"
          icon={isPlaying ? 'tabler:pause' : 'tabler:play'}
          onClick={onPlayPause}
        />
        <div className="flex w-full flex-col items-center gap-2 *:first:w-full sm:flex-row sm:gap-4">
          <WavesurferPlayer
            barGap={2}
            barRadius={100}
            barWidth={3}
            cursorColor={themeColor}
            height={50}
            progressColor={themeColor}
            url={`${import.meta.env.VITE_API_HOST}/media/${entry.file}`}
            waveColor={
              (lightOrDarkTheme === 'system' &&
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches) ||
              lightOrDarkTheme === 'dark'
                ? bgTempPalette[700]
                : bgTempPalette[400]
            }
            width="100%"
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onReady={onReady}
          />
          <p className="text-bg-500 w-full whitespace-nowrap text-left text-sm sm:w-auto">
            {moment().startOf('day').seconds(currentTime).format('mm:ss')} /{' '}
            {moment().startOf('day').seconds(totalTime).format('mm:ss')}
          </p>
        </div>
        <HamburgerMenu>
          {entry.transcription === '' && (
            <MenuItem
              preventDefault
              icon="tabler:file-text"
              loading={transcriptionLoading}
              namespace="modules.momentVault"
              text="Transcribe to Text"
              onClick={(_, close) => {
                addTranscription().then(close).catch(console.error)
              }}
            />
          )}
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={() => onDelete(entry)}
          />
        </HamburgerMenu>
      </div>
      {entry.transcription && (
        <div className="border-custom-500 mt-6 border-l-4 pl-4">
          <p className="text-bg-500">{entry.transcription}</p>
        </div>
      )}
      <p className="text-bg-500 mt-4 flex items-center gap-2">
        <Icon icon="tabler:clock" /> {moment(entry.created).fromNow()}
      </p>
    </div>
  )
}

export default AudioEntry
