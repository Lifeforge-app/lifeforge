import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import {
  ConfirmationModal,
  ListboxInput,
  ListboxOption,
  ModalHeader
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.momentVault')

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
      <ModalHeader
        icon="tabler:plus"
        namespace="apps.momentVault"
        title="Add Entry"
        onClose={onClose}
      />
      <div className="space-y-3">
        <ListboxInput
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
          label="Entry Type"
          namespace="apps.momentVault"
          setValue={setInnerOpenType}
          value={innerOpenType}
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
