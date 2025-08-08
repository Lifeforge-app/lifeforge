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

type Collection = {
  id: string
  name: string
}

function SidebarCollectionItem({
  data,
  isActive,
  onCancel,
  onSelect
}: {
  data: Collection
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
        <MenuItem
          isRed
          icon="tabler:trash"
          text="delete"
          onClick={handleDelete}
        />
      }
      icon="tabler:folder"
      label={data.name}
      namespace="apps.scoresLibrary"
      onCancelButtonClick={onCancel}
      onClick={handleSelect}
    />
  )
}

export default SidebarCollectionItem
