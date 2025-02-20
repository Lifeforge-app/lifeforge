import { Icon } from '@iconify/react/dist/iconify.js'
import WavesurferPlayer from '@wavesurfer/react'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import WaveSurfer from 'wavesurfer.js'
import { Button, CreateOrModifyButton } from '@components/buttons'
import useThemeColors from '@hooks/useThemeColor'
import { IMomentVaultEntry } from '@interfaces/moment_vault_interfaces'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import APIRequest from '@utils/fetchData'

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
}): React.ReactElement {
  const { t } = useTranslation('modules.momentVault')
  const { theme, bgTemp } = useThemeColors()
  const { theme: lightOrDarkTheme } = usePersonalizationContext()

  const [recording, setRecording] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcribeLoading, setTranscribeLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder
    audioChunksRef.current = []

    mediaRecorder.ondataavailable = event => {
      console.log(event.data)
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
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

    await APIRequest({
      endpoint: 'moment-vault/transcribe',
      method: 'POST',
      body,
      isJSON: false,
      successInfo: 'transcribe',
      failureInfo: 'transcribe',
      callback(data) {
        setTranscription(data.data)
        setTranscribeLoading(false)
      },
      onFailure() {
        setTranscribeLoading(false)
      }
    })
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

    await APIRequest({
      endpoint: 'moment-vault/entries',
      method: 'POST',
      body,
      isJSON: false,
      successInfo: 'create',
      failureInfo: 'create',
      callback(data) {
        onSuccess(data.data)
      },
      finalCallback() {
        setSubmitLoading(false)
      }
    })
  }

  return (
    <>
      <div className="flex w-full flex-col rounded-md bg-bg-200/50 p-6 shadow-custom dark:bg-bg-800/50">
        <div className="flex items-center gap-4 text-bg-500">
          <Icon className="size-6" icon="tabler:microphone" />
          <span className="font-medium">
            {t(`modules.momentVault:inputs.audio`)}{' '}
            <span className="text-red-500">*</span>
          </span>
        </div>
        {audioURL && (
          <>
            <div className="w-full flex items-center mt-6 gap-4 bg-bg-300/50 dark:bg-bg-800 [&>*:nth-child(2)]:w-full md:pr-8 shadow-custom rounded-md p-4">
              <Button
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
                  url={audioURL}
                  waveColor={
                    (lightOrDarkTheme === 'system' &&
                      window.matchMedia &&
                      window.matchMedia('(prefers-color-scheme: dark)')
                        .matches) ||
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
            </div>
            {transcription && (
              <div className="mt-6 border-l-4 border-custom-500 pl-4">
                <p className="text-bg-500">{transcription}</p>
              </div>
            )}
            <Button
              className="mt-6 w-full"
              icon="tabler:transfer"
              loading={transcribeLoading}
              variant="no-bg"
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
      <CreateOrModifyButton
        className="w-full mt-8!"
        disabled={!audioURL}
        loading={submitLoading}
        type="create"
        onClick={onSubmit}
      />
    </>
  )
}

export default AudioType
