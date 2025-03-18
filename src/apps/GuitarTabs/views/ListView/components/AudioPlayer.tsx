import { useEffect, useState } from 'react'

import { Button } from '@lifeforge/ui'

function AudioPlayer({ url }: { url: string }) {
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
        className="p-2!"
        icon={isPlaying ? 'tabler:pause' : 'tabler:play'}
        variant="plain"
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
      />
    </div>
  )
}

export default AudioPlayer
