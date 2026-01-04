import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'

import type { Achievement } from '../../..'
import ModifyAchievementModal from '../../modals/ModifyAchievementModal'

function ActionMenu({ entry }: { entry: Achievement }) {
  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const deleteMutation = useMutation(
    forgeAPI.achievements.entries.remove
      .input({
        id: entry.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['achievements']
          })
        }
      })
  )

  const handleDeleteEntry = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Achievement',
      description: 'Are you sure you want to delete this achievement?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [entry])

  const handleUpdateEntry = useCallback(() => {
    open(ModifyAchievementModal, {
      modifyType: 'update',
      initialData: entry
    })
  }, [entry])

  return (
    <ContextMenu classNames={{ wrapper: 'absolute right-3 top-3' }}>
      <ContextMenuItem
        icon="tabler:pencil"
        label="Edit"
        onClick={handleUpdateEntry}
      />
      <ContextMenuItem
        dangerous
        icon="tabler:trash"
        label="Delete"
        onClick={handleDeleteEntry}
      />
    </ContextMenu>
  )
}

export default ActionMenu
