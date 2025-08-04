import { type SocketEvent, useSocketContext } from '@providers/SocketProvider'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
import { Button, ModalHeader, QueryWrapper, TextInput } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import VideoInfo from './components/VideoInfo'

const URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(watch\?v=|embed\/|v\/|.+\?v=)?(?<id>[A-Za-z0-9_-]{11})(\S*)?$/

function YoutubeDownloaderModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()

  const socket = useSocketContext()

  const [loading, setLoading] = useState(false)

  const [videoURLinput, setVideoURLInput] = useState('')

  const videoURL = useDebounce(videoURLinput, 300)

  const videoInfoQuery = useQuery(
    forgeAPI.music.youtube.getVideoInfo
      .input({
        id: videoURL.match(URL_REGEX)?.groups?.id ?? ''
      })
      .queryOptions({
        enabled: URL_REGEX.test(videoURL)
      })
  )

  async function downloadVideo() {
    setLoading(true)

    try {
      const taskId = await forgeAPI.music.youtube.downloadVideo
        .input({
          id: videoURL.match(URL_REGEX)?.groups?.id ?? ''
        })
        .mutate({
          title: videoInfoQuery.data?.title ?? 'Unknown Title',
          uploader: videoInfoQuery.data?.uploader ?? 'Unknown Author',
          duration: parseInt(videoInfoQuery.data?.duration ?? '0', 10)
        })

      setLoading(true)

      socket.on('taskPoolUpdate', (data: SocketEvent<undefined, ''>) => {
        console.log(data)
        if (!data || data.taskId !== taskId) return

        if (data.status === 'completed') {
          toast.success('Music downloaded successfully!')
          setLoading(false)
          queryClient.invalidateQueries({
            queryKey: ['music', 'entries']
          })
          onClose()
        } else if (data.status === 'failed') {
          toast.error('Failed to download music!')
          setLoading(false)
        }
      })
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
        icon="tabler:link"
        label="Video URL"
        namespace="apps.music"
        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        setValue={setVideoURLInput}
        value={videoURLinput}
      />
      <div className="mt-6">
        {URL_REGEX.test(videoURL) && (
          <QueryWrapper query={videoInfoQuery}>
            {videoInfo => (
              <>
                <VideoInfo videoInfo={videoInfo} />
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
    </div>
  )
}

export default YoutubeDownloaderModal
