import { Icon } from '@iconify/react'
import React from 'react'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import { type IYoutubeVideoInfo } from '@interfaces/youtube_video_storage_interfaces'
import VideoInfo from '../../Music/modals/YoutubeDownloaderModal/components/VideoInfo'

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
}): React.ReactElement {
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
              title="No download process"
              description="There are no download process at the moment."
              icon="tabler:download-off"
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
                    {status === 'in_progress' ? (
                      <div className="flex items-center justify-end gap-2">
                        <p className="text-bg-500">{progress}%</p>
                        <div className="h-1 w-48 rounded-md bg-bg-500">
                          <div
                            className="h-full rounded-md bg-custom-500 transition-all"
                            style={{
                              width: `${progress}%`
                            }}
                          />
                        </div>
                      </div>
                    ) : status !== null ? (
                      <p
                        className={`flex items-center gap-2 ${
                          status === 'completed'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        <Icon
                          icon={
                            status === 'completed'
                              ? 'tabler:check'
                              : 'tabler:alert-circle'
                          }
                          className="size-5"
                        />
                        {status === 'completed' ? 'Downloaded' : 'Failed'}
                      </p>
                    ) : (
                      <></>
                    )}
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
