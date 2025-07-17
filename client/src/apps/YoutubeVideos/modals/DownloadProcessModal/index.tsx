import { EmptyStateScreen, ModalHeader } from '@lifeforge/ui'

import VideoInfo from '../../../Music/modals/YoutubeDownloaderModal/components/VideoInfo'
import { type IYoutubeVideoInfo } from '../../interfaces/youtube_video_storage_interfaces'
import ProgressIndicator from './components/ProgressIndicator'

function DownloadProcessModal({
  onClose,
  data: { processes }
}: {
  data: {
    processes:
      | Record<
          string,
          {
            status: 'completed' | 'failed' | 'in_progress' | null
            progress: number
            metadata: IYoutubeVideoInfo
          }
        >
      | 'loading'
      | 'error'
  }
  onClose: () => void
}) {
  return (
    <div className="min-w-[70vw]">
      <ModalHeader
        icon="tabler:download"
        title="Download Process"
        onClose={onClose}
      />
      {Object.keys(processes).length === 0 ? (
        <EmptyStateScreen
          icon="tabler:download-off"
          name="downloadProcesses"
          namespace="apps.youtubeVideos"
        />
      ) : (
        <>
          {Object.entries(processes).map(
            ([id, { status, progress, metadata }]) => (
              <div
                key={id}
                className="flex items-center justify-between gap-16 p-4"
              >
                <div className="flex items-center gap-3">
                  <VideoInfo videoInfo={metadata} />
                </div>
                <ProgressIndicator progress={progress} status={status} />
              </div>
            )
          )}
        </>
      )}
    </div>
  )
}

export default DownloadProcessModal
