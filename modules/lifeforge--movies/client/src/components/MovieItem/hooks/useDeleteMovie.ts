import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ConfirmationModal, toast, useModalStore } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

export function useDeleteMovie(id: string) {
  const queryClient = useQueryClient()
  const { open } = useModalStore()

  const deleteMutation = useMutation(
    forgeAPI.entries.remove.input({ id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: forgeAPI.key })
      },
      onError: () => {
        toast.error('Failed to delete movie entry')
      }
    })
  )

  const handleDeleteTicket = () => {
    open(ConfirmationModal, {
      title: 'Delete Movie',
      description: 'Are you sure you want to delete this movie?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }

  return handleDeleteTicket
}
