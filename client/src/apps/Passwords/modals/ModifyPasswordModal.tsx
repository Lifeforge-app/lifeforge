import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import { type InferInput } from 'shared'

import {
  type PasswordEntry,
  usePasswordContext
} from '@apps/Passwords/providers/PasswordsProvider'

import { encrypt } from '../../../core/security/utils/encryption'

function ModifyPasswordModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: PasswordEntry & {
      decrypted?: string
    }
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const { masterPassword } = usePasswordContext()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.passwords.entries.create
      : forgeAPI.passwords.entries.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['passwords', 'entries'] })
      },
      onError: () => {
        toast.error('Failed to modify password entry')
      }
    })
  )

  const formProps = defineForm<
    InferInput<(typeof forgeAPI.passwords.entries)[typeof type]>['body']
  >()
    .ui({
      icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
      namespace: 'apps.passwords',
      title: `password.${type}`,
      onClose,
      submitButton: type
    })
    .typesMap({
      icon: 'icon',
      color: 'color',
      website: 'text',
      username: 'text',
      password: 'text',
      name: 'text',
      master: 'text'
    })
    .setupFields({
      name: {
        label: 'serviceName',
        icon: 'tabler:lock',
        placeholder: 'My Service',
        required: true
      },
      icon: {
        label: 'serviceIcon',
        required: true
      },
      color: {
        label: 'serviceColor',
        required: true
      },
      website: {
        label: 'website',
        icon: 'tabler:link',
        placeholder: 'https://example.com',
        required: true
      },
      username: {
        label: 'usernameOrEmail',
        icon: 'tabler:user',
        placeholder: 'johndoe1234'
      },
      password: {
        label: 'password',
        icon: 'tabler:key',
        placeholder: 'Your password',
        required: true,
        isPassword: true
      }
    })
    .initialData({
      name: initialData?.name ?? '',
      icon: initialData?.icon ?? '',
      color: initialData?.color ?? '',
      website: initialData?.website ?? '',
      username: initialData?.username ?? '',
      password: initialData?.decrypted ?? ''
    })
    .onSubmit(async data => {
      const challenge = await forgeAPI.passwords.entries.getChallenge.query()

      const encryptedMaster = encrypt(masterPassword, challenge)

      const encryptedPassword = encrypt(data.password, challenge)

      await mutation.mutateAsync({
        ...data,
        password: encryptedPassword,
        master: encryptedMaster
      })
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyPasswordModal
