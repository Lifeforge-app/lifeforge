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
import PhotoType from './components/PhotoType'
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
    id: 'photos',
    icon: 'tabler:photo'
  },
  {
    id: 'video',
    icon: 'tabler:video'
  }
]

function AddEntryModal({
  data: { entriesQueryKey, type },
  onClose
}: {
  data: {
    entriesQueryKey: unknown[]
    type: 'text' | 'audio' | 'photos' | 'video'
  }
  onClose: () => void
}) {
  const { t } = useTranslation('apps.momentVault')
  const queryClient = useQueryClient()
  const [overwriteAudioWarningModalOpen, setOverwriteAudioWarningModalOpen] =
    useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)
  const [innerOpenType, setInnerOpenType] = useState<
    'text' | 'audio' | 'photos' | 'video'
  >(type)

  useEffect(() => {
    if (type === null) {
      setAudioURL(null)
      setTranscription(null)
    }
  }, [type])

  return (
    <div className="min-w-[50vw]">
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
                icon={TYPES.find(l => l.id === innerOpenType)?.icon ?? ''}
              />
              <span className="-mt-px block truncate">
                {t(`entryTypes.${TYPES.find(l => l.id === innerOpenType)?.id}`)}
              </span>
            </>
          }
          icon="tabler:apps"
          name="Entry Type"
          namespace="apps.momentVault"
          setValue={setInnerOpenType}
          type="listbox"
          value={innerOpenType}
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
          const components = {
            audio: (
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
            ),
            text: (
              <TextType
                onSuccess={() => {
                  onClose()
                  queryClient.invalidateQueries({
                    queryKey: entriesQueryKey
                  })
                }}
              />
            ),
            photos: (
              <PhotoType
                onSuccess={() => {
                  onClose()
                  queryClient.invalidateQueries({
                    queryKey: entriesQueryKey
                  })
                }}
              />
            )
          }
          return components[innerOpenType as keyof typeof components] || <></>
        })()}
      </div>
      <ModalWrapper isOpen={overwriteAudioWarningModalOpen} zIndex={10}>
        <DeleteConfirmationModal
          data={{
            customConfirmButtonIcon: 'tabler:reload',
            customConfirmButtonText: 'Overwrite',
            customOnClick: async () => {
              setAudioURL(null)
              setTranscription(null)
              setOverwriteAudioWarningModalOpen(false)
            },
            customText: 'Are you sure you want to overwrite the current audio?',
            customTitle: 'Overwrite Audio'
          }}
          onClose={() => {
            setOverwriteAudioWarningModalOpen(false)
          }}
        />
      </ModalWrapper>
    </div>
  )
}

export default AddEntryModal
