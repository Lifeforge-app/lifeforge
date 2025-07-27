import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'

import type { IdeaBoxFolder } from '@apps/IdeaBox/providers/IdeaBoxProvider'

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

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.ideaBox.folders.create
      : forgeAPI.ideaBox.folders.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['idea-box', 'folders'] })
      },
      onError: error => {
        toast.error(`Failed to ${type} folder: ${error.message}`)
      }
    })
  )

  const formProps = defineForm<
    InferInput<(typeof forgeAPI.ideaBox.folders)[typeof type]>['body']
  >()
    .ui({
      icon: {
        create: 'tabler:plus',
        update: 'tabler:pencil'
      }[type],
      namespace: 'apps.ideaBox',
      title: `folder.${type}`,
      onClose,
      submitButton: type
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
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyFolderModal
