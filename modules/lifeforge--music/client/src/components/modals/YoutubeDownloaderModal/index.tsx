import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'

import { type SocketEvent, useSocketContext } from '@lifeforge/api'
import { Button, ModalHeader, TextInput, WithQuery, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

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
    forgeAPI.youtube.getVideoInfo
      .input({
        id: videoURL.match(URL_REGEX)?.groups?.id ?? ''
      })
      .queryOptions({
        enabled: URL_REGEX.test(videoURL)
      })
  )

  const isAPIKeyExistQuery = useQuery(
    forgeAPI.checkAPIKeys({ keys: 'openai' }).queryOptions()
  )

  const [targetMusicName, setTargetMusicName] = useState('')
  const [targetMusicAuthor, setTargetMusicAuthor] = useState('')
  const [aiParsingLoading, setAiParsingLoading] = useState(false)

  async function downloadVideo() {
    try {
      setDownloadProgress('Downloading...')

      const taskId = await forgeAPI.youtube.downloadVideo
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
        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        value={videoURLinput}
        onChange={setVideoURLInput}
      />
      <div className="mt-3">
        {URL_REGEX.test(videoURL) && (
          <WithQuery query={videoInfoQuery}>
            {videoInfo => (
              <div className="space-y-3">
                <VideoInfo videoInfo={videoInfo} />
                <TextInput
                  actionButtonProps={
                    isAPIKeyExistQuery.isLoading
                      ? {
                          loading: true
                        }
                      : isAPIKeyExistQuery.data
                        ? {
                            icon: 'mage:stars-c',
                            loading: aiParsingLoading,
                            onClick: async () => {
                              if (!videoInfoQuery.data) return

                              setAiParsingLoading(true)

                              try {
                                const response =
                                  await forgeAPI.youtube.parseMusicNameAndAuthor.mutate(
                                    {
                                      title: videoInfoQuery.data?.title || '',
                                      uploader:
                                        videoInfoQuery.data?.uploader || ''
                                    }
                                  )

                                if (!response) {
                                  toast.error(
                                    'Failed to parse music name and author'
                                  )

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
                          }
                        : undefined
                  }
                  icon="tabler:music"
                  label="Music Name"
                  placeholder="Beautiful Music"
                  value={targetMusicName}
                  onChange={setTargetMusicName}
                />
                <TextInput
                  icon="tabler:user"
                  label="Music Author"
                  placeholder="John Doe"
                  value={targetMusicAuthor}
                  onChange={setTargetMusicAuthor}
                />
                <Button
                  className="mt-6 w-full max-w-full"
                  icon={
                    downloadProgress
                      ? 'svg-spinners:ring-resize'
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
