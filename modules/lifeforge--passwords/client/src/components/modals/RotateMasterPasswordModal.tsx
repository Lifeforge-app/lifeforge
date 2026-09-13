import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { encrypt as forgeEncrypt } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  FormModal,
  TextField,
  createDefaultValues,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { wrapVEK } from '@/utils/vek'

import ShowRecoveryKeyModal from './ShowRecoveryKeyModal'

const schema = z
  .object({
    existingPassword: z.string().min(1, 'Required'),
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
  .superRefine(({ existingPassword, newPassword }, ctx) => {
    if (newPassword === existingPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'New password cannot be the same as existing password',
        path: ['newPassword']
      })
    }
  })

function RotateMasterPasswordModal({
  data: { vek },
  onClose
}: {
  data: {
    vek: CryptoKey
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { open } = useModalStore()
  const { t } = useModuleTranslation()

  const mutation = useMutation(
    forgeAPI.master.updateWrappedVEK.mutationOptions({
      onSuccess: data => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.master.hasMasterPassword.key
        })
        toast.success(t('toasts.masterPasswordRotated'))
        onClose()

        open(ShowRecoveryKeyModal, { recoveryKey: data.recovery_key })
      },
      onError: () => {
        toast.error(t('toasts.rotateFailed'))
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
        label: 'Rotate Password',
        icon: 'tabler:rotate',
        handler: async data => {
          const challenge = await forgeAPI.master.getChallenge.query()

          const encryptedOldMaster = forgeEncrypt(
            data.existingPassword,
            challenge
          )
          const encryptedNewMaster = forgeEncrypt(data.newPassword, challenge)

          const vekBytes = await crypto.subtle.exportKey('raw', vek)
          const newWrappedVEK = await wrapVEK(vekBytes, data.newPassword)

          await mutation.mutateAsync({
            password: encryptedOldMaster,
            new_password: encryptedNewMaster,
            new_wrapped_vek: newWrappedVEK
          })
        }
      }}
      uiConfig={{
        icon: 'tabler:key',
        namespace: 'apps.passwords',
        title: 'masterPassword.rotate',
        onClose
      }}
    >
      <TextField
        autoFocus
        isPassword
        control={form.control}
        icon="tabler:lock"
        label="masterPassword.existingPassword"
        name="existingPassword"
        placeholder="••••••••"
      />
      <TextField
        isPassword
        control={form.control}
        icon="tabler:lock"
        label="masterPassword.newPassword"
        name="newPassword"
        placeholder="••••••••"
      />
      <TextField
        isPassword
        control={form.control}
        icon="tabler:lock"
        label="masterPassword.confirmPassword"
        name="confirmPassword"
        placeholder="••••••••"
      />
    </FormModal>
  )
}

export default RotateMasterPasswordModal
