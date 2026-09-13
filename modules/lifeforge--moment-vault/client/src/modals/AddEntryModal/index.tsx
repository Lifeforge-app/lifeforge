import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  ConfirmationModal,
  Icon,
  ListboxInput,
  ListboxOption,
  ModalHeader,
  useModalStore
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
  data: { type },
  onClose
}: {
  data: {
    type: 'text' | 'audio' | 'photos' | 'video'
  }
  onClose: () => void
}) {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const queryClient = useQueryClient()
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)

  const [innerOpenType, setInnerOpenType] = useState<
    'text' | 'audio' | 'photos' | 'video'
  >(type)

  const handleOverrideAudioConfirm = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Overwrite Audio',
      description: 'Are you sure you want to overwrite the current audio?',
      confirmationButton: 'confirm',
      onConfirm: async () => {
        setAudioURL(null)
        setTranscription(null)
      }
    })
  }, [])

  useEffect(() => {
    if (type === null) {
      setAudioURL(null)
      setTranscription(null)
    }
  }, [type])

  return (
    <div className="min-w-[50vw]">
      <ModalHeader icon="tabler:plus" title="Add Entry" onClose={onClose} />
      <div className="space-y-3">
        <ListboxInput
          required
          icon="tabler:apps"
          label="Entry Type"
          renderContent={() => (
            <>
              <Icon
                className="size-5"
                icon={TYPES.find(l => l.id === innerOpenType)?.icon ?? ''}
              />
              <span className="-mt-px block truncate">
                {t(`entryTypes.${TYPES.find(l => l.id === innerOpenType)?.id}`)}
              </span>
            </>
          )}
          value={innerOpenType}
          onChange={setInnerOpenType}
        >
          {TYPES.map(({ id, icon }, i) => (
            <ListboxOption
              key={i}
              icon={icon}
              label={t(`entryTypes.${id}`)}
              value={id}
            />
          ))}
        </ListboxInput>
        {(() => {
          const components = {
            audio: (
              <AudioType
                audioURL={audioURL}
                setAudioURL={setAudioURL}
                setOverwriteAudioWarningModalOpen={handleOverrideAudioConfirm}
                setTranscription={setTranscription}
                transcription={transcription}
                onSuccess={() => {
                  onClose()
                  queryClient.invalidateQueries({
                    queryKey: ['momentVault', 'entries']
                  })
                }}
              />
            ),
            text: (
              <TextType
                onSuccess={() => {
                  onClose()
                  queryClient.invalidateQueries({
                    queryKey: ['momentVault', 'entries']
                  })
                }}
              />
            ),
            photos: (
              <PhotoType
                onSuccess={() => {
                  onClose()
                  queryClient.invalidateQueries({
                    queryKey: ['momentVault', 'entries']
                  })
                }}
              />
            )
          }

          return components[innerOpenType as keyof typeof components] || <></>
        })()}
      </div>
    </div>
  )
}

export default AddEntryModal
