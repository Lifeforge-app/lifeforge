import { Icon } from '@iconify/react'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type Loadable } from '@interfaces/common'
import { type IYoutubeVideosStorageEntry } from '@interfaces/youtube_video_storage_interfaces'
import PlaylistSection from './sections/PlaylistSection'
import VideoSection from './sections/VideoSection'

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
  isOpen,
  onClose,
  videos
}: {
  isOpen: boolean
  onClose: (isVideoDownloading: boolean) => void
  videos: Loadable<IYoutubeVideosStorageEntry[]>
}): React.ReactElement {
  const { t } = useTranslation('modules.youtubeVideos')
  const [selectedResourceType, setSelectedResourceType] = useState<
    'video' | 'playlist'
  >('video')
  const [isVideoDownloading, setIsVideoDownloading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVideoDownloading(false)
      setSelectedResourceType('video')
    }
  }, [isOpen])

  return (
    <ModalWrapper isOpen={isOpen} minWidth="50vw">
      <ModalHeader
        title="videos.create"
        namespace="modules.youtubeVideos"
        icon="tabler:plus"
        onClose={() => {
          onClose(isVideoDownloading)
        }}
        className="mb-4!"
      />
      <ListboxOrComboboxInput
        type="listbox"
        icon="tabler:category"
        namespace="modules.youtubeVideos"
        name="Resource Type"
        value={selectedResourceType}
        setValue={setSelectedResourceType}
        buttonContent={
          <>
            <Icon
              icon={
                RESOURCE_TYPES.find(l => l.value === selectedResourceType)
                  ?.icon ?? 'tabler:circle'
              }
              className="size-5"
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
      >
        {RESOURCE_TYPES.map(({ value, icon }) => (
          <ListboxOrComboboxOption
            key={value}
            text={t(`items.${value}`)}
            icon={icon}
            value={value}
          />
        ))}
      </ListboxOrComboboxInput>
      {(() => {
        switch (selectedResourceType) {
          case 'video':
            return (
              <VideoSection
                isOpen={isOpen}
                setIsVideoDownloading={setIsVideoDownloading}
              />
            )
          case 'playlist':
            return (
              <PlaylistSection
                videos={videos}
                isOpen={isOpen}
                setIsVideoDownloading={setIsVideoDownloading}
              />
            )
        }
      })()}
    </ModalWrapper>
  )
}

export default AddVideosModal
