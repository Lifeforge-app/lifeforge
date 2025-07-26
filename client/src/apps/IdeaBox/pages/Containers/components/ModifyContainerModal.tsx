import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { FormModal, defineForm } from 'lifeforge-ui'

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
          id: initialData!.id!
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['ideaBox', 'containers']
        })
      }
    })
  )

  const imageGenAPIKeyExistsQuery = useQuery(
    forgeAPI.ai.imageGeneration.verifyAPIKey.queryOptions()
  )

  const FORM = defineForm<
    InferInput<(typeof forgeAPI.ideaBox.containers)[typeof type]>['body']
  >()
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
        required: true,
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
            preview: `${import.meta.env.VITE_API_HOST}/media/${initialData.cover}`
          }
        : {
            file: null,
            preview: null
          }
    })
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })

  return (
    <FormModal
      form={FORM}
      submitButton={type}
      ui={{
        icon: {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type],
        title: `container.${type}`,
        onClose,
        namespace: 'apps.ideaBox'
      }}
    />
  )
}

export default ModifyContainerModal
