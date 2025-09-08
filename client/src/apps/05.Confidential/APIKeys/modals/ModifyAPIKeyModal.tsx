import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'

import { encrypt } from '../../../../core/utils/encryption'
import type { APIKeysEntry } from '../components/ContentContainer'

function ModifyAPIKeyModal({
  data: { type, initialData, masterPassword },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: APIKeysEntry
    masterPassword: string
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
  }>({
    icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
    namespace: 'core.apiKeys',
    title: `apiKey.${type}`,
    onClose,
    submitButton: type
  })
    .typesMap({
      keyId: 'text',
      name: 'text',
      description: 'text',
      icon: 'icon',
      key: 'text'
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
      key: {
        required: true,
        isPassword: true,
        placeholder: '••••••••••••••••',
        label: 'API Key',
        icon: 'tabler:key'
      }
    })
    .initialData({
      keyId: initialData?.keyId || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      icon: initialData?.icon || '',
      key: initialData?.key || ''
    })
    .onSubmit(async data => {
      const challenge = await forgeAPI.apiKeys.auth.getChallenge.query()

      const encryptedKey = encrypt(data.key, masterPassword)

      const encryptedMaster = encrypt(masterPassword, challenge)

      const encryptedEverything = encrypt(
        JSON.stringify({
          ...data,
          key: encryptedKey,
          master: encryptedMaster
        }),
        challenge
      )

      await mutation.mutateAsync({
        data: encryptedEverything
      })
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyAPIKeyModal
