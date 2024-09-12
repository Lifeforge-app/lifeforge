import React, { useEffect, useState } from 'react'
import IconButton from '../../../../Music/components/Bottombar/components/IconButton'

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
      <IconButton
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
        className="!p-2 text-bg-500 hover:bg-bg-200 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100"
      />
    </div>
  )
}

export default AudioPlayer
