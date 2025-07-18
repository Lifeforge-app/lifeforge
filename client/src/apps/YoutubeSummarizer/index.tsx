import { useDebounce } from '@uidotdev/usehooks'
import {
  EmptyStateScreen,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  TextInput
} from 'lifeforge-ui'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useAPIQuery } from 'shared/lib'
import { fetchAPI } from 'shared/lib'

import { IYoutubeVideoInfo } from '@apps/YoutubeVideos/interfaces/youtube_video_storage_interfaces'

import CaptionSelector from './components/CaptionSelector'
import SummaryDisplay from './components/SummaryDisplay'
import VideoInfo from './components/VideoInfo'

function YoutubeSummarizer() {
  const { t } = useTranslation('apps.youtubeSummarizer')
  const [videoUrl, setVideoUrl] = useState<string>('')
  const debouncedVideoUrl = useDebounce(videoUrl, 300)
  const [summarizeLoading, setSummarizeLoading] = useState(false)
  const [summarizeResult, setSummarizeResult] = useState<string | null>(null)

  const videoID = useMemo(() => {
    try {
      if (debouncedVideoUrl.includes('youtube.com/watch?v=')) {
        return new URL(debouncedVideoUrl).searchParams.get('v')
      } else if (debouncedVideoUrl.includes('youtu.be/')) {
        return debouncedVideoUrl.split('?')[0].split('/').pop()
      }
    } catch {
      return
    }
  }, [debouncedVideoUrl])

  const videoInfoQuery = useAPIQuery<
    IYoutubeVideoInfo & {
      captions: Record<
        string,
        {
          ext: string
          url: string
          name: string
        }[]
      >
      auto_captions: Record<
        string,
        {
          ext: string
          url: string
          name: string
        }[]
      >
    }
  >(
    `/youtube-summarizer/info/${videoID}`,
    ['youtube-summarizer', 'info', videoID],
    !!videoID && videoID.length === 11
  )

  async function summarizeVideo(url: string) {
    if (!url) {
      toast.error(t('errors.noCaptions'))
      return
    }

    setSummarizeLoading(true)

    try {
      const response = await fetchAPI<string>(
        import.meta.env.VITE_API_URL,
        '/youtube-summarizer/summarize',
        {
          body: { url },
          method: 'POST'
        }
      )

      setSummarizeResult(response)
    } catch {
      toast.error(t('errors.summarizeFailed'))
    } finally {
      setSummarizeLoading(false)
    }
  }

  useEffect(() => {
    setSummarizeResult(null)
  }, [videoID])

  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:brand-youtube" title="Youtube Summarizer" />
      <TextInput
        disabled={summarizeLoading}
        icon="tabler:link"
        name="video URL"
        namespace="apps.youtubeSummarizer"
        placeholder="https://www.youtube.com/watch?v=..."
        setValue={setVideoUrl}
        value={videoUrl}
      />
      {videoID?.length !== 11 ? (
        <EmptyStateScreen
          icon="tabler:link-off"
          name="videoURL"
          namespace="apps.youtubeSummarizer"
        />
      ) : (
        <div className="my-6">
          <QueryWrapper query={videoInfoQuery}>
            {videoInfo =>
              videoInfo ? (
                <>
                  <VideoInfo videoInfo={videoInfo} />
                  <CaptionSelector
                    summarizeLoading={summarizeLoading}
                    videoInfo={videoInfo}
                    onSummarize={summarizeVideo}
                  />
                  <SummaryDisplay summary={summarizeResult} />
                </>
              ) : (
                <EmptyStateScreen
                  icon="tabler:link-off"
                  name="videoURL"
                  namespace="apps.youtubeSummarizer"
                />
              )
            }
          </QueryWrapper>
        </div>
      )}
    </ModuleWrapper>
  )
}

export default YoutubeSummarizer
