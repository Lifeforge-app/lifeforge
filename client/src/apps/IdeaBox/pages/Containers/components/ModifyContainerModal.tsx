import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import type { InferInput } from 'shared'

import type { IdeaBoxContainer } from '@apps/IdeaBox/providers/IdeaBoxProvider'

function ModifyContainerModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: IdeaBoxContainer
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.ideaBox.containers.create
      : forgeAPI.ideaBox.containers.update.input({
          id: initialData?.id || ''!
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['ideaBox', 'containers']
        })
      },
      onError: () => {
        toast.error(
          `Failed to ${type === 'create' ? 'create' : 'update'} container`
        )
      }
    })
  )

  const imageGenAPIKeyExistsQuery = useQuery(
    forgeAPI.ai.imageGeneration.verifyAPIKey.queryOptions()
  )

  const formProps = defineForm<
    InferInput<(typeof forgeAPI.ideaBox.containers)[typeof type]>['body']
  >({
    icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
    title: `container.${type}`,
    onClose,
    namespace: 'apps.ideaBox',
    submitButton: type
  })
    .typesMap({
      name: 'text',
      icon: 'icon',
      color: 'color',
      cover: 'file'
    })
    .setupFields({
      name: {
        required: true,
        label: 'Container name',
        icon: 'tabler:cube',
        placeholder: 'My container'
      },
      icon: {
        required: true,
        label: 'Container icon'
      },
      color: {
        required: true,
        label: 'Container color'
      },
      cover: {
        optional: true,
        required: false,
        icon: 'tabler:photo',
        label: 'Cover Image',
        enableAIImageGeneration: imageGenAPIKeyExistsQuery.data ?? false,
        defaultImageGenerationPrompt: `I have an idea box named "${initialData?.name}", where I store all my ideas related to this title. Can you generate a thumbnail for the idea box? The image should focus on the title of this idea box instead of the fact that this is the idea box. It should clearly represent the project or whatever the idea box is used to contain the idea for. In other words, do not include any words related to "idea box" in the image unless the title of the box said so.`
      }
    })
    .initialData({
      name: initialData?.name || '',
      icon: initialData?.icon || '',
      color: initialData?.color || '',
      cover: initialData?.cover
        ? {
            file: 'keep',
            preview: forgeAPI.media.input({
              collectionId: initialData.collectionId,
              recordId: initialData.id,
              fieldId: initialData.cover,
              thumb: '0x500'
            }).endpoint
          }
        : {
            file: null,
            preview: null
          }
    })
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyContainerModal
