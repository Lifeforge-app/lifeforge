import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import WavesurferPlayer from '@wavesurfer/react'
import dayjs from 'dayjs'
import { Button, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { InferOutput } from 'shared'
import { usePersonalization } from 'shared'
import WaveSurfer from 'wavesurfer.js'

import type { MomentVaultEntry } from '@apps/MomentVault'

function AudioEntry({
  currentPage,
  entry,
  onDelete
}: {
  currentPage: number
  entry: MomentVaultEntry
  onDelete: () => void
}) {
  const stack = useModalStore(state => state.stack)

  const {
    derivedTheme,
    bgTempPalette,
    derivedThemeColor: themeColor
  } = usePersonalization()

  const queryClient = useQueryClient()

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
      const data = await forgeAPI.momentVault.transcribe.transcribeExisted
        .input({
          id: entry.id
        })
        .mutate({})

      queryClient.setQueryData(
        forgeAPI.momentVault.entries.list.input({ page: currentPage }).key,
        (
          prev:
            | InferOutput<typeof forgeAPI.momentVault.entries.list>
            | undefined
        ) => {
          if (!prev) return prev

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
        }
      )
    } catch {
      toast.error('Failed to transcribe audio')
    } finally {
      setTranscriptionLoading(false)
    }
  }

  useEffect(() => {
    if (stack.length > 0) return

    // Force rerender the component
    // This is a workaround for the issue where the component does not rerender properly for some reason
    const el = document.getElementById(`audio-entry-${entry.id}`)

    if (el) {
      el.style.willChange = 'opacity, transform'
      el.getBoundingClientRect()
    }
  }, [stack])

  return (
    <div
      className="shadow-custom component-bg relative w-full rounded-md p-6"
      id={`audio-entry-${entry.id}`}
    >
      <div className="flex items-center gap-3">
        <Button
          className="mb-6 sm:mb-0"
          icon={isPlaying ? 'tabler:pause' : 'tabler:play'}
          onClick={onPlayPause}
        />
        <div className="mr-16 flex w-full flex-col items-center gap-2 *:first:w-full sm:flex-row sm:gap-3">
          <WavesurferPlayer
            barGap={2}
            barRadius={100}
            barWidth={3}
            cursorColor={themeColor}
            height={50}
            progressColor={themeColor}
            url={
              forgeAPI.media.input({
                collectionId: entry.collectionId,
                recordId: entry.id,
                fieldId: entry.file?.[0]
              }).endpoint
            }
            waveColor={
              derivedTheme === 'dark' ? bgTempPalette[700] : bgTempPalette[400]
            }
            width="100%"
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onReady={onReady}
          />
          <p className="text-bg-500 w-full text-left text-sm whitespace-nowrap sm:w-auto">
            {dayjs().startOf('day').second(currentTime).format('mm:ss')} /{' '}
            {dayjs().startOf('day').second(totalTime).format('mm:ss')}
          </p>
        </div>
      </div>
      {entry.transcription && (
        <div className="border-custom-500 mt-6 border-l-4 pl-4">
          <p className="text-bg-500">{entry.transcription}</p>
        </div>
      )}
      <p className="text-bg-500 mt-4 flex items-center gap-2">
        <Icon icon="tabler:clock" /> {dayjs(entry.created).fromNow()}
      </p>
      <HamburgerMenu classNames={{ wrapper: 'absolute top-4 right-4' }}>
        {entry.transcription === '' && (
          <MenuItem
            preventDefault
            icon="tabler:file-text"
            loading={transcriptionLoading}
            namespace="apps.momentVault"
            text="Transcribe to Text"
            onClick={(_, close) => {
              addTranscription().then(close).catch(console.error)
            }}
          />
        )}
        <MenuItem isRed icon="tabler:trash" text="Delete" onClick={onDelete} />
      </HamburgerMenu>
    </div>
  )
}

export default AudioEntry
