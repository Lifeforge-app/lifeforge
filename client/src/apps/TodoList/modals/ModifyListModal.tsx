import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'

import type { TodoListList } from '../providers/TodoListProvider'

function ModifyListModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: TodoListList
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.todoList.lists.create
      : forgeAPI.todoList.lists.update.input({
          id: initialData!.id
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todo-list', 'lists'] })
      },
      onError: error => {
        toast.error(`Failed to ${type} list: ${error.message}`)
      }
    })
  )

  const formProps = defineForm<
    InferInput<(typeof forgeAPI.todoList.lists)[typeof type]>['body']
  >()
    .ui({
      icon: {
        create: 'tabler:plus',
        update: 'tabler:pencil'
      }[type],
      namespace: 'apps.todoList',
      title: `list.${type}`,
      onClose,
      submitButton: type
    })
    .setupFields({
      name: {
        required: true,
        label: 'List name',
        icon: 'tabler:list',
        placeholder: 'List name',
        type: 'text'
      },
      icon: {
        required: true,
        label: 'List icon',
        type: 'icon'
      },
      color: {
        required: true,
        label: 'List color',
        type: 'color'
      }
    })
    .initialData(
      initialData ?? {
        name: '',
        icon: '',
        color: '#FFFFFF'
      }
    )
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyListModal
