/* eslint-disable sonarjs/no-small-switch */
import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import {
  DeleteConfirmationModal,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  ModalHeader,
  ModalWrapper
} from '@lifeforge/ui'

import AudioType from './components/AudioType'

const TYPES = [
  {
    id: 'text',
    name: 'Text',
    icon: 'tabler:file-text'
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: 'tabler:microphone'
  },
  {
    id: 'photo',
    name: 'Photo',
    icon: 'tabler:photo'
  },
  {
    id: 'video',
    name: 'Video',
    icon: 'tabler:video'
  }
]

function AddEntryModal({
  entriesQueryKey,
  openType,
  setOpenType,
  onClose
}: {
  entriesQueryKey: unknown[]
  openType: 'text' | 'audio' | 'photo' | 'video' | null
  setOpenType: (type: 'text' | 'audio' | 'photo' | 'video' | null) => void
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const [overwriteAudioWarningModalOpen, setOverwriteAudioWarningModalOpen] =
    useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)

  useEffect(() => {
    if (openType === null) {
      setAudioURL(null)
      setTranscription(null)
    }
  }, [openType])

  return (
    <>
      <ModalWrapper isOpen={openType !== null} minWidth="50vw">
        <ModalHeader
          icon="tabler:plus"
          namespace="modules.momentVault"
          title="Add Entry"
          onClose={onClose}
        />
        <div className="space-y-4">
          <ListboxOrComboboxInput
            required
            buttonContent={
              <>
                <Icon
                  className="size-5"
                  icon={TYPES.find(l => l.id === openType)?.icon ?? ''}
                />
                <span className="-mt-px block truncate">
                  {TYPES.find(l => l.id === openType)?.name ?? 'None'}
                </span>
              </>
            }
            icon="tabler:apps"
            name="Entry Type"
            namespace="modules.momentVault"
            setValue={setOpenType}
            type="listbox"
            value={openType}
          >
            {TYPES.map(({ name, id, icon }, i) => (
              <ListboxOrComboboxOption
                key={i}
                icon={icon}
                text={name}
                value={id}
              />
            ))}
          </ListboxOrComboboxInput>
          {(() => {
            switch (openType) {
              case 'audio':
                return (
                  <AudioType
                    audioURL={audioURL}
                    setAudioURL={setAudioURL}
                    setOverwriteAudioWarningModalOpen={
                      setOverwriteAudioWarningModalOpen
                    }
                    setTranscription={setTranscription}
                    transcription={transcription}
                    onSuccess={() => {
                      onClose()
                      queryClient.invalidateQueries({
                        queryKey: entriesQueryKey
                      })
                    }}
                  />
                )
              default:
                return <></>
            }
          })()}
        </div>
      </ModalWrapper>
      <DeleteConfirmationModal
        customConfirmButtonIcon="tabler:reload"
        customConfirmButtonText="Overwrite"
        customOnClick={async () => {
          setAudioURL(null)
          setTranscription(null)
          setOverwriteAudioWarningModalOpen(false)
        }}
        customText="Are you sure you want to overwrite the current audio?"
        customTitle="Overwrite Audio"
        isOpen={overwriteAudioWarningModalOpen}
        onClose={() => setOverwriteAudioWarningModalOpen(false)}
      />
    </>
  )
}

export default AddEntryModal
