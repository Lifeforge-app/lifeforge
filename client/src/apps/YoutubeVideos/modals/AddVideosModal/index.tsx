import { Icon } from '@iconify/react'
import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  ModalHeader
} from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type IYoutubeVideosStorageEntry } from '../../interfaces/youtube_video_storage_interfaces'
import PlaylistSection from './sections/PlaylistSection'

const RESOURCE_TYPES = [
  {
    value: 'video',
    icon: 'tabler:video'
  },
  {
    value: 'playlist',
    icon: 'tabler:list'
  }
]

function AddVideosModal({
  data: { videos },
  onClose
}: {
  data: {
    videos: IYoutubeVideosStorageEntry[]
  }
  onClose: (isVideoDownloading: boolean) => void
}) {
  const { t } = useTranslation('apps.youtubeVideos')
  const [selectedResourceType, setSelectedResourceType] = useState<
    'video' | 'playlist'
  >('video')
  const [isVideoDownloading, setIsVideoDownloading] = useState(false)

  useEffect(() => {
    setIsVideoDownloading(false)
    setSelectedResourceType('video')
  }, [])

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        className="mb-4!"
        icon="tabler:plus"
        namespace="apps.youtubeVideos"
        title="videos.create"
        onClose={() => {
          onClose(isVideoDownloading)
        }}
      />
      <ListboxOrComboboxInput
        buttonContent={
          <>
            <Icon
              className="size-5"
              icon={
                RESOURCE_TYPES.find(l => l.value === selectedResourceType)
                  ?.icon ?? 'tabler:circle'
              }
            />
            <span className="-mt-px block truncate">
              {t(
                `items.${
                  RESOURCE_TYPES.find(l => l.value === selectedResourceType)
                    ?.value
                }`
              ) ?? ''}
            </span>
          </>
        }
        icon="tabler:category"
        name="Resource Type"
        namespace="apps.youtubeVideos"
        setValue={setSelectedResourceType}
        type="listbox"
        value={selectedResourceType}
      >
        {RESOURCE_TYPES.map(({ value, icon }) => (
          <ListboxOrComboboxOption
            key={value}
            icon={icon}
            text={t(`items.${value}`)}
            value={value}
          />
        ))}
      </ListboxOrComboboxInput>
      {(() => {
        switch (selectedResourceType) {
          case 'video':
            return (
              <></> //TODO
              // <VideoSection setIsVideoDownloading={setIsVideoDownloading} />
            )
          case 'playlist':
            return (
              <PlaylistSection
                setIsVideoDownloading={setIsVideoDownloading}
                videos={videos}
              />
            )
        }
      })()}
    </div>
  )
}

export default AddVideosModal
