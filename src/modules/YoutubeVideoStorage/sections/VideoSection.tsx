/* eslint-disable @typescript-eslint/no-misused-promises */
import { useDebounce } from '@uidotdev/usehooks'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import Input from '@components/ButtonsAndInputs/Input'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import IntervalManager from '@utils/intervalManager'
import { type YoutubeVideoInfo } from '../../Music/modals/YoutubeDownloaderModal'
import VideoInfo from '../../Music/modals/YoutubeDownloaderModal/components/VideoInfo'

const intervalManager = IntervalManager.getInstance()

const URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(watch\?v=|embed\/|v\/|.+\?v=)?(?<id>[A-Za-z0-9_-]{11})(\S*)?$/

function VideoSection({
  onClose,
  refreshVideos
}: {
  onClose: () => void
  refreshVideos: () => void
}): React.ReactElement {
  const [videoUrl, setVideoUrl] = useState<string>('')
  const debouncedVideoUrl = useDebounce(videoUrl, 500)
  const [videoInfo] = useFetch<YoutubeVideoInfo>(
    `/youtube-video-storage/video/get-info/${
      debouncedVideoUrl.match(URL_REGEX)?.groups?.id
    }`,
    URL_REGEX.test(debouncedVideoUrl)
  )
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  function updateValue(e: React.ChangeEvent<HTMLInputElement>): void {
    setVideoUrl(e.target.value)
  }

  async function checkDownloadStatus(): Promise<{
    status: 'completed' | 'failed' | 'in_progress'
    progress: number
  }> {
    const res = await fetch(
      `${
        import.meta.env.VITE_API_HOST
      }/youtube-video-storage/video/download-status`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
    if (res.status === 200) {
      const data = await res.json()
      return data.data
    }
    return {
      status: 'failed',
      progress: 0
    }
  }

  function downloadVideo(): void {
    setLoading(true)
    setProgress(0)

    fetch(
      `${
        import.meta.env.VITE_API_HOST
      }/youtube-video-storage/video/async-download/${
        debouncedVideoUrl.match(URL_REGEX)?.groups?.id
      }`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify({
          metadata: videoInfo
        })
      }
    )
      .then(async res => {
        if (res.status === 202) {
          const data = await res.json()
          if (data.state === 'accepted') {
            intervalManager.setInterval(async () => {
              const { status, progress } = await checkDownloadStatus()
              switch (status) {
                case 'completed':
                  toast.success('Video downloaded successfully!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  setProgress(0)
                  refreshVideos()
                  onClose()
                  break
                case 'failed':
                  toast.error('Failed to download video!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  setProgress(0)
                  break
                default:
                  setProgress(progress)
                  break
              }
            }, 1000)
          }
        } else {
          const data = await res.json()
          setLoading(false)
          setProgress(0)
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error(`Oops! Couldn't download video! ${err}`)
        setLoading(false)
        setProgress(0)
      })
  }

  return (
    <>
      <Input
        icon="tabler:link"
        name="Video URL"
        placeholder="https://www.youtube.com/watch?v=..."
        value={videoUrl}
        updateValue={updateValue}
        darker
        additionalClassName="my-4"
      />
      {URL_REGEX.test(debouncedVideoUrl) && (
        <APIComponentWithFallback data={videoInfo}>
          {videoInfo => (
            <>
              <div className="mt-6 flex w-full gap-6">
                <VideoInfo videoInfo={videoInfo} />
              </div>
              {loading && (
                <div className="mt-6 h-4 w-full rounded-md bg-bg-200 dark:bg-bg-800">
                  <div
                    className="h-full rounded-md bg-custom-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              <Button
                loading={loading}
                onClick={downloadVideo}
                icon={loading ? 'svg-spinners:180-ring' : 'tabler:download'}
                className="mt-4"
              >
                {loading ? 'Downloading' : 'Download'}
              </Button>
            </>
          )}
        </APIComponentWithFallback>
      )}
    </>
  )
}

export default VideoSection
