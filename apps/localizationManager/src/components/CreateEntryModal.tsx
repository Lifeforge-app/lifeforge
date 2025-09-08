import { useMutation } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'
import React from 'react'
import { toast } from 'react-toastify'

import forgeAPI from '../utils/forgeAPI'

function CreateEntryModal({
  onClose,
  data: { target, setLocales, setOldLocales }
}: {
  onClose: () => void
  data: {
    target: [string, string, string]
    setLocales: React.Dispatch<
      React.SetStateAction<Record<string, any> | 'loading' | 'error'>
    >
    setOldLocales: React.Dispatch<
      React.SetStateAction<Record<string, any> | 'loading' | 'error'>
    >
  }
}) {
  const mutation = useMutation(
    forgeAPI.locales.manager.create.mutationOptions({
      onSuccess: (_, variables) => {
        ;[setLocales, setOldLocales].forEach(e =>
          e(prev => {
            if (typeof prev === 'string') {
              return prev
            }

            const newData = JSON.parse(JSON.stringify(prev))

            for (const lng in newData) {
              let targetObject = newData[lng]

              const path = target[2].split('.').filter(Boolean)

              for (let i = 0; i < path.length; i++) {
                if (!targetObject[path[i]]) {
                  targetObject[path[i]] = {}
                }

                targetObject = targetObject[path[i]]
              }

              targetObject[variables.path!.split('.').pop()!] =
                variables.type === 'folder' ? {} : ''
            }

            return newData
          })
        )
      },
      onError: () => {
        alert('Failed to create entry')
      }
    })
  )

  const { formProps } = defineForm<{
    namespace?: string
    subNamespace: string
    parent: string
    type: 'folder' | 'entry'
    name: string
  }>({
    icon: 'tabler:plus',
    namespace: 'apps.localizationManager',
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
      parent: target[2] || '<root>',
      type: 'entry'
    })
    .onSubmit(async data => {
      const { namespace, subNamespace, parent, type, name } = data

      if (name === '<root>') {
        toast.error('Invalid name')

        return
      }

      await mutation.mutateAsync({
        namespace: namespace as 'utils' | 'apps' | 'common' | 'core',
        subnamespace: subNamespace,
        path: [parent === '<root>' ? undefined : parent, name]
          .filter(Boolean)
          .join('.'),
        type
      })
    })
    .build()

  return <FormModal {...formProps} />
}

export default CreateEntryModal
