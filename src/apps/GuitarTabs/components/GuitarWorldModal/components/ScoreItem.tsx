import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI } from '@lifeforge/core'
import { Button } from '@lifeforge/ui'

import { type IGuitarTabsGuitarWorldScoreEntry } from '../../../interfaces/guitar_tabs_interfaces'

function ScoreItem({
  entry,
  cookie
}: {
  entry: IGuitarTabsGuitarWorldScoreEntry
  cookie: string
}) {
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(
    null
  )
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean | 'loading'>(
    false
  )
  const [isDownloading, setIsDownloading] = useState<boolean>(false)

  async function toggleMusicPlay() {
    if (audioInstance !== null) {
      if (isAudioPlaying === true) {
        audioInstance.pause()
        setIsAudioPlaying(false)
        return
      }

      setIsAudioPlaying('loading')
      await audioInstance.play()
      setIsAudioPlaying(true)
      return
    }

    const audio = new Audio(entry.audioUrl)
    setAudioInstance(audio)
    setIsAudioPlaying('loading')
    await audio.play()
    setIsAudioPlaying(true)
  }

  async function downloadScore() {
    setIsDownloading(true)

    try {
      await fetchAPI('guitar-tabs/guitar-world/download', {
        method: 'POST',
        body: {
          cookie,
          id: entry.id,
          name: entry.name,
          category: entry.category,
          mainArtist: entry.mainArtist,
          audioUrl: entry.audioUrl
        }
      })
    } catch {
      toast.error('Failed to download score')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <p className="text-lg font-medium">
          {entry.name}
          {entry.subtitle !== '' && (
            <span className="text-bg-500 text-sm"> ({entry.subtitle})</span>
          )}
        </p>
        <div className="flex items-center gap-3">
          <span
            className={clsx(
              'mt-2 inline-block rounded-full px-3 py-1 text-[12px] font-medium',
              {
                'bg-green-500/20 text-green-500':
                  entry.category === '弹唱吉他谱',
                'bg-blue-500/20 text-blue-500': entry.category === '指弹吉他谱',
                'bg-bg-500/20 text-bg-500':
                  entry.category !== '弹唱吉他谱' &&
                  entry.category !== '指弹吉他谱'
              }
            )}
          >
            {entry.category}
          </span>
          <p className="text-bg-500 mt-2 flex items-center text-sm">
            <Icon className="mr-1 size-4" icon="tabler:user" />
            {entry.mainArtist}
          </p>
          <p className="text-bg-500 mt-2 flex items-center text-sm">
            <Icon className="mr-1 size-4" icon="tabler:upload" />
            {entry.uploader}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="shrink-0"
          icon={isAudioPlaying === true ? 'tabler:pause' : 'tabler:play'}
          loading={isAudioPlaying === 'loading'}
          variant="plain"
          onClick={() => {
            toggleMusicPlay().catch(console.error)
          }}
        />
        <Button
          className="shrink-0"
          icon="tabler:download"
          loading={isDownloading}
          variant="plain"
          onClick={() => {
            downloadScore().catch(console.error)
          }}
        />
      </div>
    </div>
  )
}

export default ScoreItem
