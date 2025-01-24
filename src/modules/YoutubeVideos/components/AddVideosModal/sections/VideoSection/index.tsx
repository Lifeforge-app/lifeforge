import { useDebounce } from '@uidotdev/usehooks'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { TextInput } from '@components/inputs'
import useFetch from '@hooks/useFetch'
import { type IYoutubeVideoInfo } from '@interfaces/youtube_video_storage_interfaces'
import IntervalManager from '@utils/intervalManager'
import VideoDetails from './components/VideoDetails'
import checkDownloadStatus from './functions/checkDownloadStatus'

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
    `youtube-videos/video/get-info/${
      debouncedVideoUrl.match(URL_REGEX)?.groups?.id
    }`,
    URL_REGEX.test(debouncedVideoUrl)
  )
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

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
      }/youtube-videos/video/async-download/${ID}`,
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
      <TextInput
        icon="tabler:link"
        name="Video URL"
        placeholder="https://www.youtube.com/watch?v=..."
        value={videoUrl}
        updateValue={setVideoUrl}
        darker
        className="my-4"
      />
      {URL_REGEX.test(debouncedVideoUrl) && (
        <VideoDetails
          videoInfo={videoInfo}
          downloadVideo={downloadVideo}
          loading={loading}
          progress={progress}
        />
      )}
    </>
  )
}

export default VideoSection
