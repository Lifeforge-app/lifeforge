import { APIFallbackComponent, Button } from '@lifeforge/ui'

import { Loadable } from '../../../../../../../core/interfaces/common'
import VideoInfo from '../../../../../../Music/modals/YoutubeDownloaderModal/components/VideoInfo'
import { type IYoutubeVideoInfo } from '../../../../../interfaces/youtube_video_storage_interfaces'

function VideoDetails({
  videoInfo,
  downloadVideo,
  loading,
  progress
}: {
  videoInfo: Loadable<IYoutubeVideoInfo>
  downloadVideo: () => void
  loading: boolean
  progress: number
}) {
  return (
    <APIFallbackComponent data={videoInfo}>
      {videoInfo => (
        <>
          <div className="mt-6 flex w-full gap-6">
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
            className="mt-4"
            icon={loading ? 'svg-spinners:180-ring' : 'tabler:download'}
            loading={loading}
            onClick={downloadVideo}
          >
            {loading ? 'Downloading' : 'Download'}
          </Button>
        </>
      )}
    </APIFallbackComponent>
  )
}

export default VideoDetails
