// import { useDebounce } from '@uidotdev/usehooks'
// import { parse as parseCookie } from 'cookie'
// import { QueryWrapper, TextInput } from 'lifeforge-ui'
// import { useEffect, useRef, useState } from 'react'
// import { toast } from 'react-toastify'
import { IYoutubeVideosStorageEntry } from '@apps/YoutubeVideos/interfaces/youtube_video_storage_interfaces'

// import { useAPIQuery } from 'shared/lib'

// import {
//   type IYoutubePlaylistEntry,
//   type IYoutubePlaylistVideoEntry,
//   type IYoutubeVideosStorageEntry
// } from '../../../../interfaces/youtube_video_storage_interfaces'
// import PlaylistDetails from './components/PlaylistDetails'

// const URL_REGEX =
//   /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(playlist\?list=|watch\?v=|embed\/|v\/|.+\?v=)?(?<list>[A-Za-z0-9_-]{34})(\S*)?$/

//TODO
function PlaylistSection({
  videos,
  setIsVideoDownloading
}: {
  videos: IYoutubeVideosStorageEntry[]
  setIsVideoDownloading: (value: boolean) => void
}) {
  console.log(videos, setIsVideoDownloading)
  // const [playlistUrl, setPlaylistUrl] = useState<string>('')
  // const debouncedPlaylistUrl = useDebounce(playlistUrl, 300)
  // const playlistInfoQuery = useAPIQuery<IYoutubePlaylistEntry>(
  //   `/youtube-videos/playlist/get-info/${
  //     debouncedPlaylistUrl.match(URL_REGEX)?.groups?.list
  //   }`,
  //   ['youtube-videos', 'playlist', 'get-info', debouncedPlaylistUrl],
  //   URL_REGEX.test(debouncedPlaylistUrl)
  // )
  // const [processes, setProcesses] = useState<
  //   Record<
  //     string,
  //     {
  //       status: 'completed' | 'failed' | 'in_progress'
  //       progress: number
  //     }
  //   >
  // >({})
  // const downloadingVideos = useRef(new Set<string>())
  // const [downloadedVideos, setDownloadedVideos] = useState<Set<string>>(
  //   new Set()
  // )

  // async function checkDownloadStatus(): Promise<
  //   Record<
  //     string,
  //     {
  //       status: 'completed' | 'failed' | 'in_progress'
  //       progress: number
  //     }
  //   >
  // > {
  //   const res = await fetch(
  //     `${import.meta.env.VITE_API_HOST}/youtube-videos/video/download-status`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${parseCookie(document.cookie).session} `
  //       },
  //       body: JSON.stringify({ id: [...downloadingVideos.current] })
  //     }
  //   )
  //   if (res.status === 200) {
  //     const data = await res.json()
  //     return data.data
  //   }
  //   return [] as any
  // }

  // const checkStatusInterval = async () => {
  //   const status = await checkDownloadStatus()
  //   setProcesses(status)

  //   Object.entries(status).forEach(([id, p]) => {
  //     if (p.status === 'completed') {
  //       downloadingVideos.current.delete(id)
  //       setDownloadedVideos(prev => prev.add(id))
  //     }
  //   })

  //   if (Object.values(status).every(p => p.status === 'completed')) {
  //     setIsVideoDownloading(false)
  //     intervalManager.clearAllIntervals()
  //   }
  // }

  // async function downloadVideo(metadata: IYoutubePlaylistVideoEntry) {
  //   if (downloadingVideos.current.has(metadata.id)) {
  //     toast.error('Video is already being downloaded')
  //     return
  //   }

  //   downloadingVideos.current.add(metadata.id)

  //   try {
  //     const res = await fetch(
  //       `${import.meta.env.VITE_API_HOST}/youtube-videos/video/async-download/${
  //         metadata.id
  //       }`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${parseCookie(document.cookie).session}`
  //         },
  //         body: JSON.stringify({
  //           metadata
  //         })
  //       }
  //     )
  //     if (res.status === 202) {
  //       const data = await res.json()
  //       if (data.state === 'accepted') {
  //         setIsVideoDownloading(true)

  //         if (intervalManager.hasIntervals()) {
  //           return
  //         }

  //         intervalManager.setInterval(checkStatusInterval, 1000)
  //       }
  //     } else {
  //       const data = await res.json()
  //       throw new Error(data.message)
  //     }
  //   } catch (err) {
  //     toast.error(`Oops! Couldn't download video! ${err}`)
  //     downloadingVideos.current.delete(metadata.id)
  //   }
  // }

  // useEffect(() => {
  //   setPlaylistUrl('')
  //   setDownloadedVideos(new Set())
  //   setProcesses({})
  //   downloadingVideos.current = new Set()

  //   return () => {
  //     intervalManager.clearAllIntervals()
  //   }
  // }, [])

  return (
    <>
      {/* <TextInput
        darker
        className="mt-4"
        disabled={downloadingVideos.current.size > 0}
        icon="tabler:link"
        name="Playlist URL"
        namespace="apps.youtubeVideos"
        placeholder="https://www.youtube.com/playlist?list=PL..."
        setValue={setPlaylistUrl}
        value={playlistUrl}
      />
      <div className="mt-6">
        {URL_REGEX.test(playlistUrl) && (
          <QueryWrapper query={playlistInfoQuery}>
            {playlistInfo => (
              <PlaylistDetails
                downloadedVideos={downloadedVideos}
                downloadingVideos={downloadingVideos}
                downloadVideo={downloadVideo}
                playlistInfo={playlistInfo}
                processes={processes}
                videos={videos}
              />
            )}
          </QueryWrapper>
        )}
      </div> */}
    </>
  )
}

export default PlaylistSection
