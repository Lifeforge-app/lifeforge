import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'

import forgeAPI from '../../utils/forgeAPI'

function CreateEntryModal({
  onClose,
  data: { target }
}: {
  onClose: () => void
  data: {
    target: [string, string, string]
  }
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    forgeAPI.locales.manager.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['locales', 'manager'] })
      },
      onError: () => {
        alert('Failed to create entry')
      }
    })
  )

  const formProps = defineForm<{
    namespace: string
    subNamespace: string
    parent: string
    type: 'folder' | 'entry'
    name: string
  }>()
    .ui({
      icon: 'tabler:plus',
      namespace: 'utils.localeAdmin',
      title: 'entry.create',
      onClose,
      submitButton: 'create'
    })
    .typesMap({
      namespace: 'text',
      subNamespace: 'text',
      parent: 'text',
      type: 'listbox',
      name: 'text'
    })
    .setupFields({
      namespace: {
        label: 'Namespace',
        placeholder: 'Enter namespace',
        required: true,
        icon: 'tabler:category-2',
        disabled: true
      },
      subNamespace: {
        label: 'Sub Namespace',
        placeholder: 'Enter sub namespace',
        required: true,
        icon: 'tabler:cube',
        disabled: true
      },
      parent: {
        label: 'Parent',
        placeholder: 'Enter parent',
        required: true,
        icon: 'tabler:folder',
        disabled: true
      },
      type: {
        label: 'Type',
        options: [
          { value: 'folder', text: 'Folder', icon: 'tabler:folder' },
          { value: 'entry', text: 'Entry', icon: 'tabler:file-text' }
        ],
        required: true,
        icon: 'tabler:category-2',
        multiple: false
      },
      name: {
        label: 'Name',
        placeholder: 'Enter name',
        required: true,
        icon: 'tabler:file-text'
      }
    })
    .initialData({
      namespace: target[0],
      subNamespace: target[1],
      parent: target[2] || 'root'
    })
    .onSubmit(async data => {
      const { namespace, subNamespace, parent, type, name } = data

      await mutation.mutateAsync({
        namespace: namespace as 'utils' | 'apps' | 'common' | 'core',
        subnamespace: subNamespace,
        path: [parent, name].filter(Boolean).join('.'),
        type
      })
    })
    .build()

  return <FormModal {...formProps} />
}

export default CreateEntryModal
