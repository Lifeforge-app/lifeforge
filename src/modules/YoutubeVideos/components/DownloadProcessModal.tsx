import { Icon } from '@iconify/react'

import {
  APIFallbackComponent,
  EmptyStateScreen,
  ModalHeader,
  ModalWrapper
} from '@lifeforge/ui'

import VideoInfo from '../../Music/modals/YoutubeDownloaderModal/components/VideoInfo'
import { type IYoutubeVideoInfo } from '../interfaces/youtube_video_storage_interfaces'

function ProgressIndicator({
  status,
  progress
}: {
  status: 'completed' | 'failed' | 'in_progress' | null
  progress: number
}) {
  switch (status) {
    case 'in_progress':
      return (
        <div className="flex items-center justify-end gap-2">
          <p className="text-bg-500">{progress}%</p>
          <div className="bg-bg-500 h-1 w-48 rounded-md">
            <div
              className="bg-custom-500 h-full rounded-md transition-all"
              style={{
                width: `${progress}%`
              }}
            />
          </div>
        </div>
      )
    case 'completed':
      return (
        <p className="flex items-center gap-2 text-green-500">
          <Icon className="size-5" icon="tabler:check" />
          Downloaded
        </p>
      )
    case 'failed':
      return (
        <p className="flex items-center gap-2 text-red-500">
          <Icon className="size-5" icon="tabler:alert-circle" />
          Failed
        </p>
      )
    default:
      return <></>
  }
}

function DownloadProcessModal({
  isOpen,
  onClose,
  processes
}: {
  isOpen: boolean
  onClose: () => void
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
}) {
  return (
    <ModalWrapper isOpen={isOpen} minWidth="70vw">
      <ModalHeader
        icon="tabler:download"
        title="Download Process"
        onClose={onClose}
      />
      <APIFallbackComponent data={processes}>
        {processes =>
          Object.keys(processes).length === 0 ? (
            <EmptyStateScreen
              icon="tabler:download-off"
              name="downloadProcesses"
              namespace="modules.youtubeVideos"
            />
          ) : (
            <>
              {Object.entries(processes).map(
                ([id, { status, progress, metadata }]) => (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-16 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <VideoInfo videoInfo={metadata} />
                    </div>
                    <ProgressIndicator progress={progress} status={status} />
                  </div>
                )
              )}
            </>
          )
        }
      </APIFallbackComponent>
    </ModalWrapper>
  )
}

export default DownloadProcessModal
