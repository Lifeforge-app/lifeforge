import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ConfirmationModal, toast, useModalStore } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

export function useToggleWatched({
  id,
  title,
  is_watched
}: {
  id: string
  title: string
  is_watched: boolean
}) {
  const queryClient = useQueryClient()
  const { open } = useModalStore()

  const toggleWatchedMutation = useMutation(
    forgeAPI.entries.toggleWatchStatus.input({ id }).mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: forgeAPI.entries.key })
      },
      onError: () => {
        toast.error('Failed to mark movie as watched.')
      }
    })
  )

  const handleToggleWatched = () => {
    open(ConfirmationModal, {
      title: is_watched ? 'Mark as Unwatched' : 'Mark as Watched',
      description: `Are you sure you want to mark "${title}" as ${is_watched ? 'unwatched' : 'watched'}?`,
      confirmationButton: 'confirm',
      onConfirm: async () => {
        await toggleWatchedMutation.mutateAsync(undefined)
      }
    })
  }

  return handleToggleWatched
}
