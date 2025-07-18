/* eslint-disable sonarjs/empty-string-repetition */
import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { Button, ModalHeader, QueryWrapper, TextInput } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useAPIQuery } from 'shared/lib'
import { fetchAPI } from 'shared/lib'

import IntervalManager from '@utils/intervalManager'

import { type IYoutubeVideoInfo } from '../../../YoutubeVideos/interfaces/youtube_video_storage_interfaces'
import VideoInfo from './components/VideoInfo'

const intervalManager = IntervalManager.getInstance()

const URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(watch\?v=|embed\/|v\/|.+\?v=)?(?<id>[A-Za-z0-9_-]{11})(\S*)?$/

function YoutubeDownloaderModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [videoURLinput, setVideoURLInput] = useState('')
  const videoURL = useDebounce(videoURLinput, 300)
  const videoInfoQuery = useAPIQuery<IYoutubeVideoInfo>(
    `/music/youtube/get-info/${videoURL.match(URL_REGEX)?.groups?.id}`,
    ['music', 'youtube', 'get-info', videoURL.match(URL_REGEX)?.groups?.id],
    URL_REGEX.test(videoURL)
  )

  async function downloadVideo() {
    setLoading(true)
    try {
      await fetchAPI<{ status: string }>(
        import.meta.env.VITE_API_URL,
        `/music/youtube/async-download/${videoURL.match(URL_REGEX)?.groups?.id}`,
        {
          method: 'POST',
          body: {
            title: videoInfoQuery.data?.title ?? 'Unknown Title',
            uploader: videoInfoQuery.data?.uploader ?? 'Unknown Author',
            duration: parseInt(videoInfoQuery.data?.duration ?? '0', 10)
          }
        }
      )

      intervalManager.setInterval(async () => {
        const success = (
          await fetchAPI<{ status: string }>(
            import.meta.env.VITE_API_URL,
            'music/youtube/download-status'
          )
        ).status

        switch (success) {
          case 'completed':
            toast.success('Music downloaded successfully!')
            intervalManager.clearAllIntervals()
            setLoading(false)
            queryClient.invalidateQueries({
              queryKey: ['music', 'entries']
            })
            onClose()
            break
          case 'failed':
            toast.error('Failed to download music!')
            intervalManager.clearAllIntervals()
            setLoading(false)
            break
        }
      }, 3000)
    } catch (error) {
      console.error('Error downloading video:', error)
      toast.error('Failed to download video')
      setLoading(false)
    }
  }

  useEffect(() => {
    setVideoURLInput('')
  }, [])

  return (
    <div className="min-w-[40vw]">
      <ModalHeader
        icon="tabler:brand-youtube"
        namespace="apps.music"
        title="Download from YouTube"
        onClose={() => {
          onClose()
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
                className="mt-6 w-full"
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
    </div>
  )
}
export default YoutubeDownloaderModal
