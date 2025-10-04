import type { IdeaBoxTag } from '@/providers/IdeaBoxProvider'
import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import type { InferInput } from 'shared'

function ModifyTagModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: IdeaBoxTag
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const { id } = useParams<{ id: string }>()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.ideaBox.tags.create
      : forgeAPI.ideaBox.tags.update.input({ id: initialData?.id || '' })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ideaBox', 'tags'] })
      },
      onError: error => {
        toast.error(`Failed to ${type} tag: ${error.message}`)
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<(typeof forgeAPI.ideaBox.tags)[typeof type]>['body']
  >({
    title: `tag.${type}`,
    icon: {
      create: 'tabler:plus',
      update: 'tabler:pencil'
    }[type],
    namespace: 'apps.ideaBox',
    onClose,
    submitButton: type
  })
    .typesMap({
      name: 'text',
      icon: 'icon',
      color: 'color',
      container: 'text'
    })
    .setupFields({
      name: {
        required: true,
        label: 'Tag name',
        icon: 'tabler:tag',
        placeholder: 'My tag'
      },
      icon: {
        label: 'Tag icon',
        type: 'icon'
      },
      color: {
        label: 'Tag color',
        type: 'color'
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync({ ...data, container: id || '' })
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyTagModal
