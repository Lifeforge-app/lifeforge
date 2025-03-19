import { Icon } from '@iconify/react'
import { usePersonalization } from '@providers/PersonalizationProvider'
import WavesurferPlayer from '@wavesurfer/react'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import WaveSurfer from 'wavesurfer.js'

import { Button } from '@lifeforge/ui'

import { IMomentVaultEntry } from '@apps/MomentVault/interfaces/moment_vault_interfaces'

import fetchAPI from '@utils/fetchAPI'

function AudioType({
  onSuccess,
  audioURL,
  setAudioURL,
  transcription,
  setTranscription,
  setOverwriteAudioWarningModalOpen
}: {
  onSuccess: (data: IMomentVaultEntry) => void
  audioURL: string | null
  setAudioURL: (url: string | null) => void
  transcription: string | null
  setTranscription: (transcription: string | null) => void
  setOverwriteAudioWarningModalOpen: (open: boolean) => void
}) {
  const { t } = useTranslation('apps.momentVault')
  const {
    theme: lightOrDarkTheme,
    bgTempPalette,
    themeColor
  } = usePersonalization()

  const [recording, setRecording] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcribeLoading, setTranscribeLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const startRecording = async () => {
    setCurrentTime(0)
    setTotalTime(0)

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    streamRef.current = stream
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    mediaRecorderRef.current = mediaRecorder
    audioChunksRef.current = []

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      if (!audioChunksRef.current.length) {
        return
      }

      const audioBlob = new Blob(audioChunksRef.current, {
        type: audioChunksRef.current[0].type
      })
      const url = URL.createObjectURL(audioBlob)
      setAudioURL(url)
    }

    mediaRecorder.start()
    setRecording(true)
  }

  const stopRecording = () => {
    streamRef.current?.getTracks().forEach(track => track.stop())
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

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

  async function transcribeText() {
    setTranscribeLoading(true)

    const body = new FormData()
    const file = new File(
      audioChunksRef.current,
      `audio.${audioChunksRef.current[0].type.split('/')[1]}`,
      {
        type: audioChunksRef.current[0].type
      }
    )
    body.append('file', file)

    try {
      const data = await fetchAPI<string>('moment-vault/transcribe', {
        method: 'POST',
        body
      })

      setTranscription(data)
    } catch {
      toast.error(t('fetch.fetchError'))
    } finally {
      setTranscribeLoading(false)
    }
  }

  async function onSubmit() {
    setSubmitLoading(true)

    const body = new FormData()
    const file = new File(
      audioChunksRef.current,
      `audio.${audioChunksRef.current[0].type.split('/')[1]}`,
      {
        type: audioChunksRef.current[0].type
      }
    )

    body.append('type', 'audio')
    body.append('file', file)
    body.append('transcription', transcription ?? '')

    try {
      const data = await fetchAPI<IMomentVaultEntry>('moment-vault/entries', {
        method: 'POST',
        body
      })

      setAudioURL(null)
      setTranscription(null)
      onSuccess(data)
    } catch {
      toast.error(t('fetch.fetchError'))
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <>
      <div className="bg-bg-200/50 shadow-custom dark:bg-bg-800/50 flex w-full flex-col rounded-md p-6">
        <div className="text-bg-500 flex items-center gap-4">
          <Icon className="size-6" icon="tabler:microphone" />
          <span className="font-medium">
            {t(`apps.momentVault:inputs.audio`)}{' '}
            <span className="text-red-500">*</span>
          </span>
        </div>
        {audioURL && (
          <>
            <div className="bg-bg-300/50 dark:bg-bg-800 shadow-custom mt-6 flex w-full items-center gap-4 rounded-md p-4 md:pr-8 [&>*:nth-child(2)]:w-full">
              <Button
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
                  url={audioURL}
                  waveColor={
                    (lightOrDarkTheme === 'system' &&
                      window.matchMedia &&
                      window.matchMedia('(prefers-color-scheme: dark)')
                        .matches) ||
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
                  {dayjs().startOf('day').second(currentTime).format('mm:ss')} /{' '}
                  {dayjs().startOf('day').second(totalTime).format('mm:ss')}
                </p>
              </div>
            </div>
            {transcription && (
              <div className="border-custom-500 mt-6 border-l-4 pl-4">
                <p className="text-bg-500">{transcription}</p>
              </div>
            )}
            <Button
              className="mt-6 w-full"
              icon="tabler:transfer"
              loading={transcribeLoading}
              variant="plain"
              onClick={() => {
                transcribeText()
              }}
            >
              Transcribe To Text
            </Button>
          </>
        )}
        <Button
          className="mt-4 w-full"
          icon={recording ? 'tabler:player-stop' : 'tabler:microphone'}
          onClick={() => {
            if (audioURL !== null) {
              setOverwriteAudioWarningModalOpen(true)
              return
            }

            if (recording) {
              stopRecording()
            } else {
              startRecording()
            }
          }}
        >
          {recording ? 'Stop' : 'Record'}
        </Button>
      </div>
      <Button
        className="mt-8! w-full"
        disabled={!audioURL}
        icon="tabler:plus"
        loading={submitLoading}
        onClick={onSubmit}
      >
        Create
      </Button>
    </>
  )
}

export default AudioType
