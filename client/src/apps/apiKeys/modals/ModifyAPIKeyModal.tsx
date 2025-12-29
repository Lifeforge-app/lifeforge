import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'

import forgeAPI from '@/utils/forgeAPI'

import type { APIKeysEntry } from '..'

function ModifyAPIKeyModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: APIKeysEntry
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.apiKeys.entries.create
      : forgeAPI.apiKeys.entries.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
      },
      onError: (error: Error) => {
        toast.error('Failed to save API key: ' + error.message)
      }
    })
  )

  const { formProps } = defineForm<{
    keyId: string
    name: string
    description: string
    icon: string
    key: string
    exposable: boolean
    overrideKey: boolean
  }>({
    icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
    namespace: 'common.apiKeys',
    title: `apiKey.${type}`,
    onClose,
    submitButton: type
  })
    .typesMap({
      keyId: 'text',
      name: 'text',
      description: 'text',
      icon: 'icon',
      overrideKey: 'checkbox',
      key: 'text',
      exposable: 'checkbox'
    })
    .setupFields({
      keyId: {
        required: true,
        placeholder: 'id-of-the-api-key',
        label: 'Key ID',
        icon: 'tabler:id'
      },
      name: {
        required: true,
        placeholder: 'My API Key',
        label: 'Key Name',
        icon: 'tabler:key'
      },
      description: {
        required: true,
        placeholder: 'A short description of this key',
        label: 'Key Description',
        icon: 'tabler:info-circle'
      },
      icon: {
        required: true,
        label: 'Key Icon',
        type: 'icon'
      },
      overrideKey: {
        label: 'Override Key',
        icon: 'tabler:refresh'
      },
      key: {
        required: true,
        isPassword: true,
        placeholder: '••••••••••••••••',
        label: 'API Key',
        icon: 'tabler:key'
      },
      exposable: {
        required: false,
        label: 'isExposable',
        icon: 'tabler:eye'
      }
    })
    .conditionalFields({
      key: data => (type === 'update' ? data.overrideKey : true),
      overrideKey: () => type === 'update'
    })
    .initialData({
      keyId: initialData?.keyId || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      icon: initialData?.icon || '',
      key: '',
      exposable: initialData?.exposable || false
    })
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyAPIKeyModal
