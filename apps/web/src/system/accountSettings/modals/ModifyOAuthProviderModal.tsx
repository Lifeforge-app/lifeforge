import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import z from 'zod'

import {
  Alert,
  ConfirmationModal,
  FormModal,
  TextField,
  TextInput,
  createDefaultValues,
  toast,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

const schema = z.object({
  provider: z.string(),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1)
})

function ModifyOAuthProviderModal({
  data,
  onClose
}: {
  data: {
    type: 'create' | 'update'
    provider: string
  }
  onClose: () => void
}) {
  const { t } = useTranslation('common.account-settings')
  const { open } = useModalStore()
  const queryClient = useQueryClient()

  const upsertMutation = useMutation(
    forgeAPI.auth.oauth.providers.upsert
      .input({
        provider: data.provider
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: forgeAPI.auth.oauth.providers.key
          })
          toast.success('OAuth provider created')
        }
      })
  )

  const defaultValues =
    data.type === 'update'
      ? {
          provider: data.provider || '',
          clientId: '',
          clientSecret: ''
        }
      : createDefaultValues(schema)

  const form = useForm({
    defaultValues,
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: async formData => {
          if (data.type === 'update') {
            try {
              await new Promise((resolve, reject) =>
                open(ConfirmationModal, {
                  title: t('messages.oauth.changeConfirm'),
                  description: t('messages.oauth.changeAlert'),
                  onConfirm: async () => {
                    await upsertMutation.mutateAsync(formData)
                    resolve(undefined)
                  },
                  onReject: reject
                })
              )
            } catch {
              throw new Error('Operation aborted')
            }
          } else {
            upsertMutation.mutateAsync(formData)
          }
        },
        template: data.type
      }}
      uiConfig={{
        icon: data.type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'common.account-settings',
        title: `oauthProvider.${data.type}`,
        onClose
      }}
    >
      <Alert type="caution">{t('messages.oauth.changeAlert')}</Alert>
      <TextInput
        disabled
        icon="tabler:login"
        label="oauthProvider.provider"
        namespace="common.account-settings"
        placeholder=""
        value={data.provider}
        onChange={() => {}}
      />
      <TextField
        required
        control={form.control}
        icon="tabler:key"
        label="oauthProvider.clientId"
        name="clientId"
        placeholder="Client ID"
      />
      <TextField
        isPassword
        required
        control={form.control}
        icon="tabler:lock"
        label="oauthProvider.clientSecret"
        name="clientSecret"
        placeholder="Client Secret"
      />
    </FormModal>
  )
}

export default ModifyOAuthProviderModal
