import React, { useEffect, useState } from 'react'
import { Button } from '@components/buttons'

function AudioPlayer({ url }: { url: string }): React.ReactElement {
  const [audioPlayer, setAudioPlayer] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio(url)
    setAudioPlayer(audio)
    setIsPlaying(false)
  }, [url])

  return (
    <div className="flex items-center gap-4">
      <Button
        icon={isPlaying ? 'tabler:pause' : 'tabler:play'}
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          if (audioPlayer === null) return

          if (isPlaying) {
            audioPlayer.pause()
          } else {
            audioPlayer.play()
          }

          setIsPlaying(prev => !prev)
        }}
        variant="no-bg"
        className="p-2!"
      />
    </div>
  )
}

export default AudioPlayer
