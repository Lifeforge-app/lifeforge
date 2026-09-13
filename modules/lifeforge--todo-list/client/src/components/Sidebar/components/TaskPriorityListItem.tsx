import { useCallback } from 'react'

import { useForgeMutation } from '@lifeforge/api'
import {
  ConfirmationModal,
  ContextMenuItem,
  SidebarItem,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import ModifyPriorityModal from '@/modals/ModifyPriorityModal'
import {
  type TodoListPriority,
  useTodoListContext
} from '@/providers/TodoListProvider'

function TaskPriorityListItem({ item }: { item: TodoListPriority }) {
  const { open } = useModalStore()
  const { filter, setFilter } = useTodoListContext()

  const handleUpdatePriority = useCallback(() => {
    open(ModifyPriorityModal, {
      type: 'update',
      initialData: item
    })
  }, [item])

  const deleteMutation = useForgeMutation(
    forgeAPI.priorities.remove.input({ id: item.id }),
    {
      action: 'delete',
      queryKey: forgeAPI.key,
      onSuccess: () => {
        if (item.id === filter.priority) {
          setFilter('priority', null)
        }
      }
    }
  )

  const handleDeletePriority = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Priority',
      description: 'Are you sure you want to delete this priority?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }, [item])

  return (
    <SidebarItem
      active={filter.priority === item.id}
      contextMenuItems={
        <>
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={handleUpdatePriority}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={handleDeletePriority}
          />
        </>
      }
      label={item.name}
      namespace={false}
      number={item.amount}
      sideStripColor={item.color}
      onCancelButtonClick={() => {
        setFilter('priority', null)
      }}
      onClick={() => {
        setFilter('priority', item.id)
      }}
    />
  )
}

export default TaskPriorityListItem
