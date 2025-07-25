import type { UseQueryResult } from '@tanstack/react-query'
import { Button, QueryWrapper } from 'lifeforge-ui'

import VideoInfo from '../../../../../../Music/modals/YoutubeDownloaderModal/components/VideoInfo'
import { type IYoutubeVideoInfo } from '../../../../../interfaces/youtube_video_storage_interfaces'

function VideoDetails({
  videoInfoQuery,
  downloadVideo,
  loading,
  progress
}: {
  videoInfoQuery: UseQueryResult<IYoutubeVideoInfo>
  downloadVideo: () => void
  loading: boolean
  progress: number
}) {
  return (
    <div className="mt-6">
      <QueryWrapper query={videoInfoQuery}>
        {videoInfo => (
          <>
            <div className="flex w-full gap-6">
              <VideoInfo videoInfo={videoInfo} />
            </div>
            {loading && (
              <div className="bg-bg-200 dark:bg-bg-800 mt-6 h-4 w-full rounded-md">
                <div
                  className="bg-custom-500 h-full rounded-md transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            <Button
              className="mt-4 w-full"
              icon={loading ? 'svg-spinners:180-ring' : 'tabler:download'}
              loading={loading}
              onClick={downloadVideo}
            >
              {loading ? 'Downloading' : 'Download'}
            </Button>
          </>
        )}
      </QueryWrapper>
    </div>
  )
}

export default VideoDetails
