import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import Scrollbar from '@components/Scrollbar'
import { VIDEO_RESOLUTIONS } from '@constants/video_res'
import useFetch from '@hooks/useFetch'
import { type IYoutubeVideosStorageEntry } from '@interfaces/youtube_video_storage_interfaces'
import { cleanFileSize } from '@utils/strings'
import AddVideosModal from './components/AddVideosModal'

function YoutubeVideoStorage(): React.ReactElement {
  const [isAddVideosModalOpen, setIsAddVideosModalOpen] = useState(false)
  const [videos, refreshVideos] = useFetch<IYoutubeVideosStorageEntry[]>(
    '/youtube-video-storage/video'
  )
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false)
  const [videoToDelete, setVideoToDelete] =
    useState<IYoutubeVideosStorageEntry>()

  return (
    <ModuleWrapper>
      <ModuleHeader
        icon="tabler:brand-youtube"
        title="Youtube Video Storage"
        desc="..."
        totalItems={videos?.length}
        actionButton={
          <Button
            icon="tabler:plus"
            onClick={() => {
              setIsAddVideosModalOpen(true)
            }}
          >
            Add Video
          </Button>
        }
      />
      <Scrollbar className="mt-8">
        <APIComponentWithFallback data={videos}>
          {videos => (
            <div className="mb-16 space-y-4">
              {videos.map(video => (
                <a
                  key={video.id}
                  href={`${import.meta.env.VITE_API_HOST
                    }/youtube-video-storage/video/stream/${video.youtube_id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="relative flex w-full items-center justify-between gap-8 rounded-md bg-bg-50 p-4 shadow-custom hover:bg-bg-200 dark:bg-bg-900 dark:hover:bg-bg-800/70"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0 overflow-hidden rounded-md border border-bg-800">
                      <img
                        src={`${import.meta.env.VITE_API_HOST
                          }/youtube-video-storage/video/thumbnail/${video.youtube_id
                          }`}
                        alt={video.title}
                        className="aspect-video w-56 rounded-md object-cover"
                      />
                      <p className="absolute bottom-2 right-2 rounded-md bg-bg-900/70 px-1.5 py-0.5 text-bg-100">
                        {moment
                          .utc(
                            moment
                              .duration(video.duration, 'seconds')
                              .asMilliseconds()
                          )
                          .format(video.duration >= 3600 ? 'H:mm:ss' : 'm:ss')}
                      </p>
                    </div>
                    <div className="flex flex-col justify-between">
                      <h3 className="text-xl font-semibold">{video.title}</h3>
                      <p className="mt-2 font-medium text-custom-500">
                        {video.uploader}
                      </p>
                      <p className="mt-6 text-bg-500">
                        Uploaded {moment(video.upload_date).fromNow()}
                      </p>
                    </div>
                  </div>
                  <div className="flex h-32 flex-col items-end justify-between gap-4">
                    <HamburgerMenu>
                      <MenuItem
                        onClick={() => {
                          setVideoToDelete(video)
                          setIsConfirmDeleteModalOpen(true)
                        }}
                        text="Delete"
                        icon="tabler:trash"
                        isRed
                      />
                    </HamburgerMenu>
                    <div className="flex items-center gap-4">
                      <p className="flex shrink-0 items-center gap-1 whitespace-nowrap text-bg-500">
                        <Icon icon="tabler:ruler" className="mr-1 size-5" />
                        {(() => {
                          const res = `${video.width}x${video.height}`

                          if (Object.keys(VIDEO_RESOLUTIONS).includes(res)) {
                            return VIDEO_RESOLUTIONS[
                              res as keyof typeof VIDEO_RESOLUTIONS
                            ]
                          }

                          return res
                        })()}
                      </p>
                      <p className="flex shrink-0 items-center gap-1 whitespace-nowrap text-bg-500">
                        <Icon icon="tabler:file" className="mr-1 size-5" />
                        {cleanFileSize(video.filesize)}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </APIComponentWithFallback>
      </Scrollbar>
      <AddVideosModal
        isOpen={isAddVideosModalOpen}
        onClose={() => {
          setIsAddVideosModalOpen(false)
        }}
        refreshVideos={refreshVideos}
      />
      <DeleteConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => {
          setIsConfirmDeleteModalOpen(false)
        }}
        apiEndpoint="/youtube-video-storage/video"
        itemName="video"
        nameKey="title"
        updateDataList={refreshVideos}
        data={videoToDelete}
      />
    </ModuleWrapper>
  )
}

export default YoutubeVideoStorage
