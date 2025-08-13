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

import type { ScoreLibraryType } from '@apps/ScoresLibrary'

import ModifyTypeModal from '../../modals/ModifyTypeModal'

function SidebarTypeItem({
  data,
  isActive,
  onCancel,
  onSelect
}: {
  data: ScoreLibraryType
  isActive: boolean
  onCancel: () => void
  onSelect: (category: string) => void
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const handleSelect = useCallback(() => {
    onSelect(data.id)
  }, [])

  const handleUpdate = useCallback(() => {
    open(ModifyTypeModal, {
      openType: 'update',
      initialData: data
    })
  }, [data])

  const deleteMutation = useMutation(
    forgeAPI.scoresLibrary.types.remove.input({ id: data.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['scoresLibrary'] })
      },
      onError: () => {
        toast.error('Failed to delete type')
      }
    })
  )

  const handleDelete = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Type',
      description: 'Are you sure you want to delete this type?',
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
      contextMenuItems={
        <>
          <ContextMenuItem
            icon="tabler:pencil"
            text="update"
            onClick={handleUpdate}
          />
          <ContextMenuItem
            isRed
            icon="tabler:trash"
            text="delete"
            onClick={handleDelete}
          />
        </>
      }
      icon={data.icon}
      label={data.name}
      namespace="apps.scoresLibrary"
      number={data.amount}
      onCancelButtonClick={onCancel}
      onClick={handleSelect}
    />
  )
}

export default SidebarTypeItem
