import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import { type IYoutubeVideoInfo } from '@interfaces/youtube_video_storage_interfaces'
import VideoInfo from '../../../../../../Music/modals/YoutubeDownloaderModal/components/VideoInfo'

function VideoDetails({
  videoInfo,
  downloadVideo,
  loading,
  progress
}: {
  videoInfo: IYoutubeVideoInfo | 'loading' | 'error'
  downloadVideo: () => void
  loading: boolean
  progress: number
}): React.ReactElement {
  return (
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
  )
}

export default VideoDetails
