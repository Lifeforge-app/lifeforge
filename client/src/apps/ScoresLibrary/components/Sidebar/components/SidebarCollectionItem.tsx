import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  ConfirmationModal,
  ContextMenuItem,
  SidebarItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import type { ScoreLibraryCollection } from '@apps/ScoresLibrary'

import ModifyCollectionModal from '../../modals/ModifyCollectionModal'

function SidebarCollectionItem({
  data,
  isActive,
  onSelect
}: {
  data: ScoreLibraryCollection
  isActive: boolean
  onSelect: (collection: string | null) => void
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const deleteMutation = useMutation(
    forgeAPI.scoresLibrary.collections.remove
      .input({ id: data.id })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['scoresLibrary'] })
        },
        onError: () => {
          toast.error('Failed to delete collection')
        }
      })
  )

  const handleDelete = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Collection',
      description:
        'Are you sure you want to delete this collection?\n\nNote: Items will not be deleted.',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [])

  return (
    <SidebarItem
      key={data.id}
      active={isActive}
      contextMenuItems={
        <>
          <ContextMenuItem
            icon="tabler:pencil"
            label="edit"
            onClick={() => {
              open(ModifyCollectionModal, {
                type: 'update',
                initialData: data
              })
            }}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="delete"
            onClick={handleDelete}
          />
        </>
      }
      icon="tabler:folder"
      label={data.name}
      number={data.amount}
      onCancelButtonClick={() => onSelect(null)}
      onClick={() => onSelect(data.id)}
    />
  )
}

export default SidebarCollectionItem
