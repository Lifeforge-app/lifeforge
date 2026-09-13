import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { encrypt as forgeEncrypt } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import { FormModal, TextField, createDefaultValues, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const schema = z
  .object({
    recoveryKey: z.string().length(64, 'Must be 64 hex characters'),
    newPassword: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string()
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword']
      })
    }
  })

function RecoverAccountModal({ onClose }: { onClose: () => void }) {
  const { t } = useModuleTranslation()

  const mutation = useMutation(
    forgeAPI.recovery.recover.mutationOptions({
      onSuccess: () => {
        toast.success(t('toasts.accountRecovered'))
        onClose()
      },
      onError: () => {
        toast.error(t('toasts.recoverAccountFailed'))
      }
    })
  )

  const form = useForm({
    defaultValues: createDefaultValues(schema),
    mode: 'all',
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        label: 'Recover Account',
        icon: 'tabler:key',
        handler: async data => {
          const challenge = await forgeAPI.master.getChallenge.query()

          const encryptedRecoveryKey = forgeEncrypt(data.recoveryKey, challenge)
          const encryptedNewPassword = forgeEncrypt(data.newPassword, challenge)

          await mutation.mutateAsync({
            recovery_key: encryptedRecoveryKey,
            new_password: encryptedNewPassword
          })
        }
      }}
      uiConfig={{
        icon: 'tabler:lock-open',
        namespace: 'apps.passwords',
        title: 'recovery.recover',
        onClose
      }}
    >
      <TextField
        autoFocus
        control={form.control}
        icon="tabler:key"
        label="recovery.recoveryKey"
        name="recoveryKey"
        placeholder="••••••••"
      />
      <TextField
        isPassword
        control={form.control}
        icon="tabler:lock"
        label="recovery.newPassword"
        name="newPassword"
        placeholder="••••••••"
      />
      <TextField
        isPassword
        control={form.control}
        icon="tabler:lock"
        label="recovery.confirmPassword"
        name="confirmPassword"
        placeholder="••••••••"
      />
    </FormModal>
  )
}

export default RecoverAccountModal
