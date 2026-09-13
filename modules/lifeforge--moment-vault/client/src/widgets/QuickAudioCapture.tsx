import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { WidgetConfig } from '@lifeforge/configs'
import { Button, Widget, toast, useDivSize } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

type RecordingState = 'idle' | 'recording' | 'submitting'

function QuickAudioCapture() {
  const queryClient = useQueryClient()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const { width, height } = useDivSize(wrapperRef)
  const [state, setState] = useState<RecordingState>('idle')
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      setState('recording')
    } catch {
      toast.error('Failed to access microphone')
    }
  }, [])

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || state !== 'recording') return

    return new Promise<void>(resolve => {
      mediaRecorderRef.current!.onstop = async () => {
        streamRef.current?.getTracks().forEach(track => track.stop())

        if (audioChunksRef.current.length === 0) {
          setState('idle')
          resolve()

          return
        }

        setState('submitting')

        const file = new File(
          audioChunksRef.current,
          `audio.${audioChunksRef.current[0].type.split('/')[1]}`,
          { type: audioChunksRef.current[0].type }
        )

        try {
          await forgeAPI.entries.create.mutate({
            type: 'audio',
            files: [file]
          })

          toast.success('Audio moment captured!')
          queryClient.invalidateQueries({
            queryKey: ['momentVault', 'entries']
          })
        } catch {
          toast.error('Failed to save audio')
        } finally {
          setState('idle')
          resolve()
        }
      }

      mediaRecorderRef.current!.stop()
    })
  }, [state, queryClient])

  const activePointerRef = useRef<number | null>(null)
  const stopRecordingRef = useRef(stopRecording)

  stopRecordingRef.current = stopRecording

  useEffect(() => {
    const handleGlobalPointerUp = (e: PointerEvent) => {
      if (activePointerRef.current === e.pointerId) {
        activePointerRef.current = null
        stopRecordingRef.current()
      }
    }

    window.addEventListener('pointerup', handleGlobalPointerUp)
    window.addEventListener('pointercancel', handleGlobalPointerUp)

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp)
      window.removeEventListener('pointercancel', handleGlobalPointerUp)
    }
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()

      // Prevent multiple pointer events from triggering
      if (activePointerRef.current !== null) return

      activePointerRef.current = e.pointerId

      if (state === 'idle') {
        startRecording()
      }
    },
    [state, startRecording]
  )

  return (
    <Widget className="p-2! min-[400px]:p-4!" icon="tabler:microphone">
      <div ref={wrapperRef} className="flex-center min-h-0 flex-1">
        <Button
          className={`aspect-square touch-none min-[400px]:rounded-full! ${
            width < height ? 'h-full w-full min-[400px]:h-auto' : 'h-full'
          } ${state === 'recording' ? 'animate-pulse' : ''}`}
          icon={
            state === 'recording'
              ? 'tabler:player-stop-filled'
              : 'tabler:microphone'
          }
          iconProps={{ className: 'size-full! sm:size-10!' }}
          loading={state === 'submitting'}
          variant={state === 'recording' ? 'secondary' : 'primary'}
          onPointerDown={handlePointerDown}
        />
      </div>
    </Widget>
  )
}

export default QuickAudioCapture

export const config: WidgetConfig = {
  id: 'quickAudioCapture',
  icon: 'tabler:microphone',
  minW: 1,
  maxW: 1,
  minH: 1,
  maxH: 1
}
