/* eslint-disable @typescript-eslint/no-misused-promises */
import { useDebounce } from '@uidotdev/usehooks'
import { cookieParse } from 'pocketbase'
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Input from '@components/ButtonsAndInputs/Input'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import {
  type IYoutubePlaylistVideoEntry,
  type IYoutubePlaylistEntry,
  type IYoutubeVideosStorageEntry
} from '@interfaces/youtube_video_storage_interfaces'
import IntervalManager from '@utils/intervalManager'
import PlaylistInfo from './componenets/PlaylistInfo'

const intervalManager = IntervalManager.getInstance()

const URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(playlist\?list=|watch\?v=|embed\/|v\/|.+\?v=)?(?<list>[A-Za-z0-9_-]{34})(\S*)?$/

function PlaylistSection({
  videos,
  refreshVideos
}: {
  videos: IYoutubeVideosStorageEntry[] | 'loading' | 'error'
  refreshVideos: () => void
}): React.ReactElement {
  const [playlistUrl, setPlaylistUrl] = useState<string>('')
  const debouncedPlaylistUrl = useDebounce(playlistUrl, 500)
  const [playlistInfo] = useFetch<IYoutubePlaylistEntry>(
    `/youtube-video-storage/playlist/get-info/${debouncedPlaylistUrl.match(URL_REGEX)?.groups?.list
    }`,
    URL_REGEX.test(debouncedPlaylistUrl)
  )
  const [processes, setProcesses] = useState<
    Record<
      string,
      {
        status: 'completed' | 'failed' | 'in_progress'
        progress: number
      }
    >
  >({})
  const downloadingVideos = useRef([] as string[])
  const [downloadedVideos, setDownloadedVideos] = useState<Set<string>>(
    new Set()
  )

  async function checkDownloadStatus(): Promise<
    Record<
      string,
      {
        status: 'completed' | 'failed' | 'in_progress'
        progress: number
      }
    >
  > {
    const res = await fetch(
      `${import.meta.env.VITE_API_HOST
      }/youtube-video-storage/video/download-status`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token} `
        },
        body: JSON.stringify({ id: downloadingVideos.current })
      }
    )
    if (res.status === 200) {
      const data = await res.json()
      return data.data
    }
    return [] as any
  }

  function updatePlaylistUrl(e: React.ChangeEvent<HTMLInputElement>): void {
    setPlaylistUrl(e.target.value)
  }

  function downloadVideo(metadata: IYoutubePlaylistVideoEntry): void {
    if (downloadingVideos.current.includes(metadata.id)) {
      toast.error('Video is already being downloaded')
      return
    }

    downloadingVideos.current.push(metadata.id)

    fetch(
      `${import.meta.env.VITE_API_HOST
      }/youtube-video-storage/video/async-download/${metadata.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify({
          metadata
        })
      }
    )
      .then(async res => {
        if (res.status === 202) {
          const data = await res.json()
          if (data.state === 'accepted') {
            if (!intervalManager.hasIntervals()) {
              intervalManager.setInterval(async () => {
                const status = await checkDownloadStatus()
                setProcesses(status)

                Object.entries(status).forEach(([id, p]) => {
                  if (p.status === 'completed') {
                    setDownloadedVideos(prev => prev.add(id))
                  }
                })

                if (
                  Object.values(status).every(p => p.status === 'completed')
                ) {
                  intervalManager.clearAllIntervals()
                  refreshVideos()
                  downloadingVideos.current = []
                }
              }, 1000)
            }
          }
        } else {
          const data = await res.json()
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error(`Oops! Couldn't download video! ${err}`)
        downloadingVideos.current = []
      })
  }

  return (
    <>
      <Input
        icon="tabler:link"
        name="Playlist URL"
        value={playlistUrl}
        updateValue={updatePlaylistUrl}
        placeholder="https://www.youtube.com/playlist?list=PL..."
        darker
        additionalClassName="mt-4"
        disabled={downloadingVideos.current.length > 0}
      />
      <div className="mt-6">
        {URL_REGEX.test(playlistUrl) && (
          <APIComponentWithFallback data={playlistInfo}>
            {playlistInfo => (
              <PlaylistInfo
                playlistInfo={playlistInfo}
                downloadingVideos={downloadingVideos}
                downloadVideo={downloadVideo}
                videos={videos}
                downloadedVideos={downloadedVideos}
                processes={processes}
              />
            )}
          </APIComponentWithFallback>
        )}
      </div>
    </>
  )
}

export default PlaylistSection
