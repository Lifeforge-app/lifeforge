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

import type { ScoreLibraryType } from '@apps/04.Storage/ScoresLibrary'
import useFilter from '@apps/04.Storage/ScoresLibrary/hooks/useFilter'

import ModifyTypeModal from '../../modals/ModifyTypeModal'

function SidebarTypeItem({
  data,
  isActive
}: {
  data: ScoreLibraryType
  isActive: boolean
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const { updateFilter } = useFilter()

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
            label="update"
            onClick={handleUpdate}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="delete"
            onClick={handleDelete}
          />
        </>
      }
      icon={data.icon}
      label={data.name}
      number={data.amount}
      onCancelButtonClick={() => updateFilter('category', null)}
      onClick={() => updateFilter('category', data.id)}
    />
  )
}

export default SidebarTypeItem
