import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { FormModal, TextField, createDefaultValues, toast } from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

const schema = z
  .object({
    oldPassword: z.string().min(1, 'Password is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirm: z
      .string()
      .min(8, 'Confirm Password must be at least 8 characters')
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['passwordConfirm']
      })
    }
  })

export default function ChangePasswordModal({
  onClose
}: {
  onClose: () => void
}) {
  const mutation = useMutation(
    forgeAPI.user.settings.updatePassword.mutationOptions({
      onSuccess: () => {
        toast.success('Password updated successfully')
        onClose()
      },
      onError: err => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to update password'
        toast.error(msg)
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
        handler: mutation.mutateAsync,
        template: 'update'
      }}
      uiConfig={{
        icon: 'tabler:key',
        namespace: 'common.account-settings',
        title: 'changePassword.title',
        onClose
      }}
    >
      <TextField
        isPassword
        required
        control={form.control}
        icon="tabler:lock"
        label="currentPassword"
        name="oldPassword"
        placeholder=""
      />
      <TextField
        isPassword
        required
        control={form.control}
        icon="tabler:lock-open"
        label="newPassword"
        name="password"
        placeholder=""
      />
      <TextField
        isPassword
        required
        control={form.control}
        icon="tabler:lock-check"
        label="confirmPassword"
        name="passwordConfirm"
        placeholder=""
      />
    </FormModal>
  )
}
