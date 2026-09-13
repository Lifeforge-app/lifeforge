import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import { ConfirmationModal, toast, useModalStore } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { PasswordEntry } from '..'

export default function useDeletePassword(password: PasswordEntry) {
  const queryClient = useQueryClient()
  const { open } = useModalStore()
  const { t } = useModuleTranslation()

  const deleteMutation = useMutation(
    forgeAPI.entries.remove.input({ id: password.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: forgeAPI.entries.list.key })
      },
      onError: () => {
        toast.error(t('toasts.entryDeleteFailed'))
      }
    })
  )

  const handleDeletePassword = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Password',
      description: `Are you sure you want to delete the password for ${password.name}? This action cannot be undone.`,
      confirmationButton: 'delete',
      onConfirm: () => deleteMutation.mutateAsync(undefined)
    })
  }, [password])

  return { handleDeletePassword }
}
