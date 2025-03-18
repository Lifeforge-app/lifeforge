/* eslint-disable sonarjs/empty-string-repetition */
import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { parse as parseCookie } from 'cookie'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import {
  Button,
  ModalHeader,
  ModalWrapper,
  QueryWrapper,
  TextInput
} from '@lifeforge/ui'

import { useMusicContext } from '@apps/Music/providers/MusicProvider'

import useAPIQuery from '@hooks/useAPIQuery'

import IntervalManager from '@utils/intervalManager'

import { type IYoutubeVideoInfo } from '../../../YoutubeVideos/interfaces/youtube_video_storage_interfaces'
import VideoInfo from './components/VideoInfo'

const intervalManager = IntervalManager.getInstance()

const URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(watch\?v=|embed\/|v\/|.+\?v=)?(?<id>[A-Za-z0-9_-]{11})(\S*)?$/

function YoutubeDownloaderModal() {
  const queryClient = useQueryClient()
  const { isYoutubeDownloaderOpen: isOpen, setIsYoutubeDownloaderOpen } =
    useMusicContext()
  const [loading, setLoading] = useState(false)
  const [videoURLinput, setVideoURLInput] = useState('')
  const videoURL = useDebounce(videoURLinput, 500)
  const videoInfoQuery = useAPIQuery<IYoutubeVideoInfo>(
    `/music/youtube/get-info/${videoURL.match(URL_REGEX)?.groups?.id}`,
    ['music', 'youtube', 'get-info', videoURL.match(URL_REGEX)?.groups?.id],
    URL_REGEX.test(videoURL)
  )

  async function checkDownloadStatus(): Promise<
    'completed' | 'failed' | 'in_progress'
  > {
    const res = await fetch(
      `${import.meta.env.VITE_API_HOST}/music/youtube/download-status`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${parseCookie(document.cookie).token}`
        }
      }
    )
    if (res.status === 200) {
      const data = await res.json()
      return data.data.status
    }
    return 'failed'
  }

  function downloadVideo() {
    setLoading(true)
    fetch(
      `${import.meta.env.VITE_API_HOST}/music/youtube/async-download/${
        videoURL.match(URL_REGEX)?.groups?.id
      }`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${parseCookie(document.cookie).token}`
        },
        body: JSON.stringify({
          metadata: videoInfoQuery.data
        })
      }
    )
      .then(async res => {
        if (res.status === 202) {
          const data = await res.json()
          if (data.state === 'accepted') {
            intervalManager.setInterval(async () => {
              const success = await checkDownloadStatus()
              switch (success) {
                case 'completed':
                  toast.success('Music downloaded successfully!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  setIsYoutubeDownloaderOpen(false)
                  queryClient.invalidateQueries({
                    queryKey: ['music', 'entries']
                  })
                  break
                case 'failed':
                  toast.error('Failed to download music!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  break
              }
            }, 3000)
          }
        } else {
          const data = await res.json()
          setLoading(false)
          throw new Error(`Failed to download music. Error: ${data.message}`)
        }
      })
      .catch(err => {
        toast.error(`Oops! Couldn't download music! Error: ${err}`)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (isOpen) {
      setVideoURLInput('')
    }
  }, [])

  return (
    <ModalWrapper isOpen={isOpen} minWidth="40vw">
      <ModalHeader
        icon="tabler:brand-youtube"
        namespace="apps.music"
        title="Download from YouTube"
        onClose={() => {
          setIsYoutubeDownloaderOpen(false)
          queryClient.invalidateQueries({
            queryKey: ['music', 'entries']
          })
        }}
      />
      <TextInput
        darker
        className="mb-8"
        icon="tabler:link"
        name="Video URL"
        namespace="apps.music"
        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        setValue={setVideoURLInput}
        value={videoURLinput}
      />
      {URL_REGEX.test(videoURL) && (
        <QueryWrapper query={videoInfoQuery}>
          {videoInfo => (
            <>
              <div className="mt-6 flex w-full gap-6">
                <VideoInfo videoInfo={videoInfo} />
              </div>
              <Button
                className="mt-6"
                icon={loading ? 'svg-spinners:180-ring' : 'tabler:download'}
                loading={loading}
                onClick={downloadVideo}
              >
                {loading ? 'Downloading' : 'Download'}
              </Button>
            </>
          )}
        </QueryWrapper>
      )}
    </ModalWrapper>
  )
}
export default YoutubeDownloaderModal
