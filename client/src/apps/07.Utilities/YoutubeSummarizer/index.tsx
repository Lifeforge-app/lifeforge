import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
import {
  EmptyStateScreen,
  ModuleHeader,
  TextInput,
  WithQuery
} from 'lifeforge-ui'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import type { InferOutput } from 'shared'

import CaptionSelector from './components/CaptionSelector'
import SummaryDisplay from './components/SummaryDisplay'
import VideoInfo from './components/VideoInfo'

export type YoutubeInfo = InferOutput<
  typeof forgeAPI.youtubeSummarizer.getYoutubeVideoInfo
>

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

  const videoInfoQuery = useQuery(
    forgeAPI.youtubeSummarizer.getYoutubeVideoInfo
      .input({
        id: videoID || ''
      })
      .queryOptions({ enabled: !!videoID && videoID.length === 11 })
  )

  async function summarizeVideo(url: string) {
    if (!url) {
      toast.error(t('errors.noCaptions'))

      return
    }

    setSummarizeLoading(true)

    try {
      const response = await forgeAPI.youtubeSummarizer.summarizeVideo.mutate({
        url
      })

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
    <>
      <ModuleHeader />
      <TextInput
        disabled={summarizeLoading}
        icon="tabler:link"
        label="video URL"
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
          <WithQuery query={videoInfoQuery}>
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
          </WithQuery>
        </div>
      )}
    </>
  )
}

export default YoutubeSummarizer
