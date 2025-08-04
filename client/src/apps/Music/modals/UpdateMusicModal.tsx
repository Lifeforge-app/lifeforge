import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'

import type { MusicEntry } from '../providers/MusicProvider'

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
    forgeAPI.music.entries.update
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

  const formProps = defineForm<{
    name: string
    author: string
  }>()
    .ui({
      namespace: 'apps.music',
      icon: 'tabler:pencil',
      title: 'updateMusic',
      submitButton: 'update',
      onClose
    })
    .typesMap({
      name: 'text',
      author: 'text'
    })
    .setupFields({
      name: {
        label: 'Music Name',
        placeholder: "John Doe's Music",
        icon: 'tabler:music',
        required: true
      },
      author: {
        label: 'Music Author',
        placeholder: 'John Doe',
        icon: 'tabler:user',
        required: true
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default UpdateMusicModal
