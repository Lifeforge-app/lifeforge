import type { Entry } from '@'
import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import { type InferInput } from 'shared'

function ModifyEntryModal({
  onClose,
  data: { openType, initialData }
}: {
  onClose: () => void
  data: {
    openType: 'create' | 'update'
    initialData?: Entry
  }
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (openType === 'create'
      ? forgeAPI.{{camel moduleName.en}}.entries.create
      : forgeAPI.{{camel moduleName.en}}.entries.update.input({
          id: initialData!.id
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['{{camel moduleName.en}}', 'entries'] })
      },
      onError: error => {
        toast.error(`Failed to ${openType} entry: ${error.message}`)
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<(typeof forgeAPI.{{camel moduleName.en}}.entries)['create' | 'update']>['body']
  >({
    onClose,
    icon: openType === 'create' ? 'tabler:plus' : 'tabler:pencil',
    title: `entry.${openType}`,
    submitButton: openType,
    namespace: 'apps.{{camel moduleName.en}}'
  })
    .typesMap({
      name: 'text',
      color: 'color',
      icon: 'icon'
    })
    .setupFields({
      name: {
        label: 'name',
        required: true,
        placeholder: 'My {{moduleName.en}} Entry',
        icon: 'tabler:cube'
      },
      icon: {
        label: 'icon',
        required: false
      },
      color: {
        label: 'color',
        required: false
      }
    })
    .autoFocusField('name')
    .initialData(initialData ?? {})
    .onSubmit(async values => {
      await mutation.mutateAsync(values)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyEntryModal
