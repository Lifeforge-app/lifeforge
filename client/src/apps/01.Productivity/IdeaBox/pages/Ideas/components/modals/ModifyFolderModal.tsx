import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import type { InferInput } from 'shared'

import type { IdeaBoxFolder } from '@apps/01.Productivity/IdeaBox/providers/IdeaBoxProvider'

function ModifyFolderModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: IdeaBoxFolder
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.ideaBox.folders.create
      : forgeAPI.ideaBox.folders.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ideaBox', 'folders'] })
      },
      onError: error => {
        toast.error(`Failed to ${type} folder: ${error.message}`)
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<(typeof forgeAPI.ideaBox.folders)[typeof type]>['body']
  >({
    icon: {
      create: 'tabler:plus',
      update: 'tabler:pencil'
    }[type],
    namespace: 'apps.ideaBox',
    title: `folder.${type}`,
    onClose,
    submitButton: type
  })
    .typesMap({
      container: 'text',
      parent: 'text',
      name: 'text',
      icon: 'icon',
      color: 'color'
    })
    .setupFields({
      name: {
        required: true,
        label: 'Folder name',
        icon: 'tabler:folder',
        placeholder: 'My Folder',
        type: 'text'
      },
      icon: {
        required: true,
        label: 'Folder icon',
        type: 'icon'
      },
      color: {
        required: true,
        label: 'Folder color',
        type: 'color'
      }
    })
    .initialData(
      initialData
        ? {
            name: initialData.name,
            icon: initialData.icon,
            color: initialData.color
          }
        : {
            name: '',
            icon: '',
            color: ''
          }
    )
    .onSubmit(async data => {
      data.container = id!
      data.parent = path?.split('/').pop() || ''
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyFolderModal
