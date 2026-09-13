import type { MomentVaultEntry } from '@'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useState } from 'react'

import type { InferOutput } from '@lifeforge/api'
import {
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Icon,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import EditTranscriptionModal from '@/modals/EditTranscriptionModal'
import { useAudioPlayer } from '@/providers/AudioPlayerProvider'

import AudioPlayer from './components/AudioPlayer'

dayjs.extend(relativeTime)

function AudioEntry({
  currentPage,
  entry,
  onDelete
}: {
  currentPage: number
  entry: MomentVaultEntry
  onDelete: () => void
}) {
  const { open } = useModalStore()
  const audioPlayerContext = useAudioPlayer()
  const queryClient = useQueryClient()
  const [transcriptionLoading, setTranscriptionLoading] = useState(false)

  async function addTranscription() {
    setTranscriptionLoading(true)

    try {
      const data = await forgeAPI.transcribe.transcribeExisted
        .input({
          id: entry.id
        })
        .mutate(undefined)

      queryClient.setQueryData(
        forgeAPI.entries.list.input({
          page: currentPage.toString()
        }).key,
        (prev: InferOutput<typeof forgeAPI.entries.list> | undefined) => {
          if (!prev) return prev

          const newData = prev.items.map(item => {
            if (item.id === entry.id) {
              return {
                ...item,
                transcription: data
              }
            }

            return item
          })

          return {
            ...prev,
            items: newData
          }
        }
      )
    } catch {
      toast.error('Failed to transcribe audio')
    } finally {
      setTranscriptionLoading(false)
    }
  }

  async function toggleReviewed() {
    try {
      await forgeAPI.entries.toggleReviewed
        .input({ id: entry.id })
        .mutate(undefined)

      queryClient.invalidateQueries({
        queryKey: ['momentVault', 'entries']
      })
    } catch {
      toast.error('Failed to toggle reviewed status')
    }
  }

  return (
    <Card as="li" id={`audio-entry-${entry.id}`}>
      <div className="mr-16">
        <AudioPlayer entry={entry} />
      </div>
      {entry.transcription && (
        <p className="text-bg-500 before:bg-custom-500 relative mt-6 pl-4 whitespace-pre-wrap before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-full">
          {entry.reviewed && (
            <div className="text-custom-500 mb-2 flex items-center gap-1 font-medium">
              <Icon icon="tabler:check" /> Reviewed
            </div>
          )}
          {entry.transcription}
        </p>
      )}
      <p className="text-bg-500 mt-4 flex items-center gap-2">
        <Icon icon="tabler:clock" /> {dayjs(entry.created).fromNow()}
      </p>
      <ContextMenu className="absolute top-4 right-4">
        {entry.transcription === '' ? (
          <ContextMenuItem
            icon="tabler:file-text"
            label="Transcribe to Text"
            loading={transcriptionLoading}
            shouldCloseMenuOnClick={false}
            onClick={() => {
              addTranscription().catch(console.error)
            }}
          />
        ) : (
          <>
            <ContextMenuItem
              icon={entry.reviewed ? 'tabler:circle-off' : 'tabler:check'}
              label={entry.reviewed ? 'Mark as Unreviewed' : 'Mark as Reviewed'}
              onClick={toggleReviewed}
            />
            {!entry.reviewed && (
              <>
                <ContextMenuItem
                  icon="tabler:pencil"
                  label="Edit Transcription"
                  onClick={() => {
                    open(EditTranscriptionModal, {
                      entry,
                      audioPlayerContext
                    })
                  }}
                />
                <ContextMenuItem
                  dangerous
                  icon="tabler:refresh"
                  label="Retranscribe"
                  loading={transcriptionLoading}
                  onClick={() => {
                    open(ConfirmationModal, {
                      title: 'Retranscribe Audio',
                      description:
                        'Are you sure you want to retranscribe the audio? This will overwrite the existing transcription.',
                      onConfirm: addTranscription
                    })
                  }}
                />
              </>
            )}
          </>
        )}
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={onDelete}
        />
      </ContextMenu>
    </Card>
  )
}

export default AudioEntry
