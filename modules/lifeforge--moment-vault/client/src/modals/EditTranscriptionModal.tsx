import type { MomentVaultEntry } from '@'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { Button, FormModal, createDefaultValues, toast } from '@lifeforge/ui'

import AudioPlayer from '@/components/entries/AudioEntry/components/AudioPlayer'
import { forgeAPI } from '@/manifest'
import type { AudioPlayerContextType } from '@/providers/AudioPlayerProvider'

const schema = z.object({
  transcription: z.string().min(1, 'Required')
})

function EditTranscriptionModal({
  onClose,
  data: { entry, audioPlayerContext }
}: {
  onClose: () => void
  data: {
    entry: MomentVaultEntry
    audioPlayerContext: AudioPlayerContextType
  }
}) {
  const queryClient = useQueryClient()
  const [cleanupLoading, setCleanupLoading] = useState(false)

  const mutation = useMutation(
    forgeAPI.transcribe.updateTranscription
      .input({ id: entry.id })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['momentVault', 'entries']
          })
        },
        onError: (error: any) => {
          console.error('Error updating transcription:', error)
          toast.error(
            'An error occurred while updating the transcription. Please try again.'
          )
        }
      })
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      transcription: entry.transcription
    },
    resolver: zodResolver(schema)
  })

  async function handleCleanup() {
    const data = form.getValues()

    try {
      setCleanupLoading(true)

      const shouldUseNewText =
        data.transcription.trim() !== entry.transcription?.trim()

      const response = await forgeAPI.transcribe.cleanupTranscription
        .input({
          id: entry.id,
          newText: shouldUseNewText ? data.transcription : undefined
        })
        .mutate(undefined)

      form.setValue('transcription', response)
      setCleanupLoading(false)
    } catch (error: any) {
      console.error('Error cleaning up transcription:', error)
      toast.error(
        'An error occurred while cleaning up the transcription. Please try again.'
      )
    }
  }

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: 'update',
        handler: async values => {
          await mutation.mutateAsync(values)
        }
      }}
      uiConfig={{
        icon: 'tabler:pencil',
        loading: false,
        namespace: 'apps.momentVault',
        title: 'Edit Transcription',
        onClose,
        headerActions: (
          <Button
            icon="mage:stars-c"
            loading={cleanupLoading}
            namespace="apps.momentVault"
            variant="plain"
            onClick={handleCleanup}
          >
            Cleanup
          </Button>
        )
      }}
    >
      <AudioPlayer audioPlayerContext={audioPlayerContext} entry={entry} />
    </FormModal>
  )
}

export default EditTranscriptionModal
