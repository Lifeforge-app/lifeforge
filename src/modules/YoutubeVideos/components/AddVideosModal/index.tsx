import { Icon } from '@iconify/react'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
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
    label: 'Video',
    value: 'video',
    icon: 'tabler:video'
  },
  {
    label: 'Playlist',
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
        title="Add Videos"
        icon="tabler:plus"
        onClose={() => {
          onClose(isVideoDownloading)
        }}
        className="!mb-4"
      />
      <ListboxOrComboboxInput
        type="listbox"
        icon="tabler:category"
        name={t('input.resourceType')}
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
              {RESOURCE_TYPES.find(l => l.value === selectedResourceType)
                ?.label ?? 'None'}
            </span>
          </>
        }
      >
        {RESOURCE_TYPES.map(({ value, label, icon }) => (
          <ListboxOrComboboxOption
            key={value}
            text={label}
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
