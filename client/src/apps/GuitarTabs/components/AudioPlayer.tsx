import { useState } from 'react'

import { Button } from '@lifeforge/ui'

function AudioPlayer({ url }: { url: string }) {
  const [audioLoading, setAudioLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  function togglePlay() {
    if (audio) {
      if (audio.paused) {
        audio.play()
        setIsPlaying(true)
      } else {
        audio.pause()
        setIsPlaying(false)
      }
    } else {
      setAudioLoading(true)
      const newAudio = new Audio(url)
      newAudio.preload = 'auto'
      newAudio.addEventListener('canplaythrough', () => {
        setAudioLoading(false)
        setIsPlaying(true)
        newAudio.play()
        setAudio(newAudio)
      })
      newAudio.addEventListener('ended', () => {
        setIsPlaying(false)
      })
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        className="p-2!"
        icon={(() => {
          if (audioLoading) {
            return 'svg-spinners:180-ring'
          }

          return isPlaying ? 'tabler:pause' : 'tabler:play'
        })()}
        variant="plain"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          togglePlay()
        }}
      />
    </div>
  )
}

export default AudioPlayer
