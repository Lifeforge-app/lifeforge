import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  ConfirmationModal,
  MenuItem,
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
  onCancel,
  onSelect
}: {
  data: ScoreLibraryCollection
  isActive: boolean
  onCancel: () => void
  onSelect: (collection: string) => void
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const handleSelect = useCallback(() => {
    onSelect(data.id)
  }, [])

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
      buttonType: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [])

  return (
    <SidebarItem
      key={data.id}
      active={isActive}
      hamburgerMenuItems={
        <>
          <MenuItem
            icon="tabler:pencil"
            text="edit"
            onClick={() => {
              open(ModifyCollectionModal, {
                type: 'update',
                initialData: data
              })
            }}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="delete"
            onClick={handleDelete}
          />
        </>
      }
      icon="tabler:folder"
      label={data.name}
      namespace="apps.scoresLibrary"
      number={data.amount}
      onCancelButtonClick={onCancel}
      onClick={handleSelect}
    />
  )
}

export default SidebarCollectionItem
