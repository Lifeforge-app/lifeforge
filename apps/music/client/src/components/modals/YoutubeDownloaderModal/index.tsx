import forgeAPI from '@/utils/forgeAPI'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { Button, ModalHeader, TextInput, WithQuery } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { type SocketEvent, useSocketContext } from 'shared'

import VideoInfo from './components/VideoInfo'

const URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/(watch\?v=|embed\/|v\/|.+\?v=)?(?<id>[A-Za-z0-9_-]{11})(\S*)?$/

function YoutubeDownloaderModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()

  const socket = useSocketContext()

  const [downloadProgress, setDownloadProgress] = useState<string | boolean>(
    false
  )

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

  const [targetMusicName, setTargetMusicName] = useState('')

  const [targetMusicAuthor, setTargetMusicAuthor] = useState('')

  const [aiParsingLoading, setAiParsingLoading] = useState(false)

  async function downloadVideo() {
    try {
      setDownloadProgress('Downloading...')

      const taskId = await forgeAPI.music.youtube.downloadVideo
        .input({
          id: videoURL.match(URL_REGEX)?.groups?.id ?? ''
        })
        .mutate({
          title: targetMusicName || videoInfoQuery.data?.title || '',
          uploader: targetMusicAuthor || videoInfoQuery.data?.uploader || '',
          duration: parseInt(videoInfoQuery.data?.duration ?? '0', 10)
        })

      socket.on('taskPoolUpdate', (data: SocketEvent<undefined, string>) => {
        if (!data || data.taskId !== taskId) return

        if (data.status === 'completed') {
          toast.success('Music downloaded successfully!')
          setDownloadProgress(false)
          queryClient.invalidateQueries({
            queryKey: ['music', 'entries']
          })
          onClose()
        } else if (data.status === 'failed') {
          toast.error('Failed to download music!')
          setDownloadProgress(false)
        } else {
          setDownloadProgress(data.progress || 'Downloading...')
        }
      })
    } catch (error) {
      console.error('Error downloading video:', error)
      toast.error('Failed to download video')
      setDownloadProgress(false)
    }
  }

  useEffect(() => {
    if (videoInfoQuery.data) {
      setTargetMusicName(videoInfoQuery.data.title || '')
      setTargetMusicAuthor(videoInfoQuery.data.uploader || '')
    } else {
      setVideoURLInput('')
      setTargetMusicName('')
      setTargetMusicAuthor('')
    }
  }, [videoInfoQuery.data])

  return (
    <div className="min-w-[40vw]">
      <ModalHeader
        icon="tabler:brand-youtube"
        namespace="apps.music"
        title="Download from Youtube"
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
      <div className="mt-3">
        {URL_REGEX.test(videoURL) && (
          <WithQuery query={videoInfoQuery}>
            {videoInfo => (
              <div className="space-y-3">
                <VideoInfo videoInfo={videoInfo} />
                <TextInput
                  actionButtonProps={{
                    icon: 'mage:stars-c',
                    loading: aiParsingLoading,
                    onClick: async () => {
                      if (!videoInfoQuery.data) return

                      setAiParsingLoading(true)

                      try {
                        const response =
                          await forgeAPI.music.youtube.parseMusicNameAndAuthor.mutate(
                            {
                              title: videoInfoQuery.data?.title || '',
                              uploader: videoInfoQuery.data?.uploader || ''
                            }
                          )

                        if (!response) {
                          toast.error('Failed to parse music name and author')

                          return
                        }

                        setTargetMusicName(response.name || '')
                        setTargetMusicAuthor(response.author || '')
                      } catch (error) {
                        toast.error(
                          `Failed to parse music name and author: ${error instanceof Error ? error.message : String(error)}`
                        )
                      } finally {
                        setAiParsingLoading(false)
                      }
                    }
                  }}
                  icon="tabler:music"
                  label="Music Name"
                  namespace="apps.music"
                  placeholder="Beautiful Music"
                  setValue={setTargetMusicName}
                  value={targetMusicName}
                />
                <TextInput
                  icon="tabler:user"
                  label="Music Author"
                  namespace="apps.music"
                  placeholder="John Doe"
                  setValue={setTargetMusicAuthor}
                  value={targetMusicAuthor}
                />
                <Button
                  className="mt-6 w-full max-w-full"
                  icon={
                    downloadProgress
                      ? 'svg-spinners:180-ring'
                      : 'tabler:download'
                  }
                  loading={!!downloadProgress}
                  onClick={downloadVideo}
                >
                  {downloadProgress ? 'Downloading' : 'Download'}
                </Button>
                {downloadProgress && (
                  <div className="text-bg-500 mt-2 text-left text-sm">
                    {downloadProgress}
                  </div>
                )}
              </div>
            )}
          </WithQuery>
        )}
      </div>
    </div>
  )
}

export default YoutubeDownloaderModal
