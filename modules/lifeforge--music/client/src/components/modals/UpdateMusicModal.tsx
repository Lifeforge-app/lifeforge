import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { FormModal, createDefaultValues, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { MusicEntry } from '../../providers/MusicProvider'

const schema = z.object({
  author: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required')
})

function UpdateMusicModal({
  data: { initialData },
  onClose
}: {
  data: {
    initialData?: MusicEntry
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    forgeAPI.entries.update
      .input({
        id: initialData?.id || ''
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['music', 'entries']
          })
        },
        onError: error => {
          toast.error(`Failed to update music: ${error.message}`)
        }
      })
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      name: initialData?.name || '',
      author: initialData?.author || ''
    },
    resolver: zodResolver(schema)
  })

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
        namespace: 'apps.music',
        title: 'updateMusic',
        onClose
      }}
    >
      <></>
    </FormModal>
  )
}

export default UpdateMusicModal
