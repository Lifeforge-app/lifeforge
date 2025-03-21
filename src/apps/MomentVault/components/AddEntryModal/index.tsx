import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  DeleteConfirmationModal,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  ModalHeader,
  ModalWrapper
} from '@lifeforge/ui'

import AudioType from './components/AudioType'
import TextType from './components/TextType'

const TYPES = [
  {
    id: 'text',
    icon: 'tabler:file-text'
  },
  {
    id: 'audio',
    icon: 'tabler:microphone'
  },
  {
    id: 'photo',
    icon: 'tabler:photo'
  },
  {
    id: 'video',
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
  const { t } = useTranslation('apps.momentVault')
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
          namespace="apps.momentVault"
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
                  {t(`entryTypes.${TYPES.find(l => l.id === openType)?.id}`)}
                </span>
              </>
            }
            icon="tabler:apps"
            name="Entry Type"
            namespace="apps.momentVault"
            setValue={setOpenType}
            type="listbox"
            value={openType}
          >
            {TYPES.map(({ id, icon }, i) => (
              <ListboxOrComboboxOption
                key={i}
                icon={icon}
                text={t(`entryTypes.${id}`)}
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
              case 'text':
                return (
                  <TextType
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
