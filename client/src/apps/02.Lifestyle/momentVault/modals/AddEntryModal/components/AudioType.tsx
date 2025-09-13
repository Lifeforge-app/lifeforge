import { Icon } from '@iconify/react'
import forgeAPI from '@utils/forgeAPI'
import WavesurferPlayer from '@wavesurfer/react'
import dayjs from 'dayjs'
import { Button } from 'lifeforge-ui'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePersonalization } from 'shared'
import WaveSurfer from 'wavesurfer.js'

function AudioType({
  onSuccess,
  audioURL,
  setAudioURL,
  transcription,
  setTranscription,
  setOverwriteAudioWarningModalOpen
}: {
  onSuccess: () => void
  audioURL: string | null
  setAudioURL: (url: string | null) => void
  transcription: string | null
  setTranscription: (transcription: string | null) => void
  setOverwriteAudioWarningModalOpen: (open: boolean) => void
}) {
  const { t } = useTranslation('apps.momentVault')

  const {
    derivedTheme,
    bgTempPalette,
    derivedThemeColor: themeColor
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
      const data = await forgeAPI.momentVault.transcribe.transcribeNew.mutate({
        file
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

    const file = new File(
      audioChunksRef.current,
      `audio.${audioChunksRef.current[0].type.split('/')[1]}`,
      {
        type: audioChunksRef.current[0].type
      }
    )

    try {
      await forgeAPI.momentVault.entries.create.mutate({
        type: 'audio',
        files: [file],
        transcription: transcription ?? ''
      })

      onSuccess()
    } catch {
      toast.error(t('fetch.fetchError'))
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <>
      <div className="bg-bg-200/50 shadow-custom dark:bg-bg-800/50 flex w-full flex-col rounded-md p-6">
        <div className="text-bg-500 flex items-center gap-3">
          <Icon className="size-6" icon="tabler:microphone" />
          <span className="font-medium">
            {t(`apps.momentVault:inputs.audio`)}{' '}
            <span className="text-red-500">*</span>
          </span>
        </div>
        {audioURL && (
          <>
            <div className="bg-bg-300/50 dark:bg-bg-800 shadow-custom mt-6 flex w-full items-center gap-3 rounded-md p-4 md:pr-8 [&>*:nth-child(2)]:w-full">
              <Button
                icon={isPlaying ? 'tabler:pause' : 'tabler:play'}
                onClick={onPlayPause}
              />
              <div className="flex w-full flex-col items-center gap-2 *:first:w-full sm:flex-row sm:gap-3">
                <WavesurferPlayer
                  barGap={2}
                  barRadius={100}
                  barWidth={3}
                  cursorColor={themeColor}
                  height={50}
                  progressColor={themeColor}
                  url={audioURL}
                  waveColor={
                    derivedTheme === 'dark'
                      ? bgTempPalette[700]
                      : bgTempPalette[400]
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
            {transcription && (
              <div className="border-custom-500 mt-6 border-l-4 pl-4">
                <p className="text-bg-500">{transcription}</p>
              </div>
            )}
            <Button
              className="mt-6 w-full"
              icon="tabler:transfer"
              loading={transcribeLoading}
              namespace="apps.momentVault"
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
