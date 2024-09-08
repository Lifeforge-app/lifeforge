import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { t } from 'i18next'
import React, { useState } from 'react'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import VideoSection from './sections/VideoSection'
import PlaylistSection from './sections/PlaylistSection'

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
  },
  {
    label: 'Channel',
    value: 'channel',
    icon: 'tabler:user'
  },
  {
    label: 'Search',
    value: 'search',
    icon: 'tabler:search'
  }
]

function AddVideosModal({
  isOpen,
  onClose,
  refreshVideos
}: {
  isOpen: boolean
  onClose: () => void
  refreshVideos: () => void
}): React.ReactElement {
  const [selectedResourceType, setSelectedResourceType] = useState<
    'video' | 'playlist' | 'channel' | 'search'
  >('video')

  return (
    <Modal isOpen={isOpen} minWidth="50vw">
      <ModalHeader
        title="Add Videos"
        icon="tabler:plus"
        onClose={onClose}
        className="!mb-4"
      />
      <ListboxInput
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
        {RESOURCE_TYPES.map(resourceType => (
          <ListboxOption
            key={resourceType.value}
            className="flex-between relative flex cursor-pointer select-none p-4 text-base transition-all hover:bg-bg-200/50 dark:hover:bg-bg-700/50"
            value={resourceType.value}
          >
            {({ selected }) => (
              <>
                <div>
                  <span className="flex items-center gap-4">
                    <Icon icon={resourceType.icon} className="size-5" />
                    {resourceType.label}
                  </span>
                </div>
                {selected && (
                  <Icon
                    icon="tabler:check"
                    className="block text-lg text-custom-500"
                  />
                )}
              </>
            )}
          </ListboxOption>
        ))}
      </ListboxInput>
      {(() => {
        switch (selectedResourceType) {
          case 'video':
            return (
              <VideoSection onClose={onClose} refreshVideos={refreshVideos} />
            )
          case 'playlist':
            return (
              <PlaylistSection
                onClose={onClose}
                refreshVideos={refreshVideos}
              />
            )
          case 'channel':
            return <div>Channel</div>
          case 'search':
            return <div>Search</div>
        }
      })()}
    </Modal>
  )
}

export default AddVideosModal
