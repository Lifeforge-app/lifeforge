/* eslint-disable @typescript-eslint/no-misused-promises */
import { useDebounce } from '@uidotdev/usehooks'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import Input from '@components/ButtonsAndInputs/Input'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { type IYoutubeVideoInfo } from '@interfaces/youtube_video_storage_interfaces'
import IntervalManager from '@utils/intervalManager'
import VideoInfo from '../../../../Music/modals/YoutubeDownloaderModal/components/VideoInfo'

const intervalManager = IntervalManager.getInstance()

const URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(watch\?v=|embed\/|v\/|.+\?v=)?(?<id>[A-Za-z0-9_-]{11})(\S*)?$/

function VideoSection({
  isOpen,
  setIsVideoDownloading
}: {
  isOpen: boolean
  setIsVideoDownloading: (value: boolean) => void
}): React.ReactElement {
  const [videoUrl, setVideoUrl] = useState<string>('')
  const debouncedVideoUrl = useDebounce(videoUrl, 500)
  const [videoInfo] = useFetch<IYoutubeVideoInfo>(
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

  async function checkDownloadStatus(id: string): Promise<{
    status: 'completed' | 'failed' | 'in_progress'
    progress: number
  }> {
    const res = await fetch(
      `${
        import.meta.env.VITE_API_HOST
      }/youtube-video-storage/video/download-status`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token} `
        },
        body: JSON.stringify({ id: [id] })
      }
    )
    if (res.status === 200) {
      const data = await res.json()
      return Object.values(data.data)[0] as {
        status: 'completed' | 'failed' | 'in_progress'
        progress: number
      }
    }
    return {
      status: 'failed',
      progress: 0
    }
  }

  function downloadVideo(): void {
    setLoading(true)
    setProgress(0)

    const ID = debouncedVideoUrl.match(URL_REGEX)?.groups?.id

    if (ID === undefined) {
      toast.error('Invalid video URL!')
      setLoading(false)
      return
    }

    fetch(
      `${
        import.meta.env.VITE_API_HOST
      }/youtube-video-storage/video/async-download/${ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token} `
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
            setIsVideoDownloading(true)
            intervalManager.setInterval(async () => {
              const { status, progress } = await checkDownloadStatus(ID)
              switch (status) {
                case 'completed':
                  toast.success('Video downloaded successfully!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  setProgress(0)
                  setIsVideoDownloading(false)
                  break
                case 'failed':
                  toast.error('Failed to download video!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  setProgress(0)
                  setIsVideoDownloading(false)
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
        setIsVideoDownloading(false)
        setLoading(false)
        setProgress(0)
      })
  }

  useEffect(() => {
    if (isOpen) {
      setVideoUrl('')
    }

    return () => {
      intervalManager.clearAllIntervals()
    }
  }, [])

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
