import { Icon } from '@iconify/react'
import { ISocketEvent, useSocketContext } from '@providers/SocketProvider'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { Button } from 'lifeforge-ui'
import { useState } from 'react'
import { toast } from 'react-toastify'

import {
  IGuitarTabsEntry,
  IGuitarTabsGuitarWorldScoreEntry
} from '@apps/GuitarTabs/interfaces/guitar_tabs_interfaces'

import fetchAPI from '@utils/fetchAPI'

function ScoreItem({
  entry,
  cookie
}: {
  entry: IGuitarTabsGuitarWorldScoreEntry
  cookie: string
}) {
  const queryClient = useQueryClient()
  const socket = useSocketContext()
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
      const taskId = await fetchAPI('guitar-tabs/guitar-world/download', {
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

      socket.on('taskPoolUpdate', (data: ISocketEvent<IGuitarTabsEntry>) => {
        if (!data || data.taskId !== taskId) return

        if (data.status === 'failed') {
          toast.error(`Failed to download score: ${data.error}`)
          setIsDownloading(false)
        }

        if (data.status === 'completed') {
          toast.success('Score downloaded successfully')
          setIsDownloading(false)

          queryClient.invalidateQueries({
            queryKey: ['guitar-tabs', 'entries']
          })
        }
      })
    } catch {
      toast.error('Failed to download score')
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
                弹唱吉他谱: 'bg-green-500/20 text-green-500',
                指弹吉他谱: 'bg-blue-500/20 text-blue-500',
                独奏钢琴谱: 'bg-purple-500/20 text-purple-500'
              }[entry.category] || 'bg-gray-500/20 text-gray-500'
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
