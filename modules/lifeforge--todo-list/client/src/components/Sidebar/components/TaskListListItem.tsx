import { useCallback } from 'react'

import { useForgeMutation } from '@lifeforge/api'
import {
  ConfirmationModal,
  ContextMenuItem,
  SidebarItem,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import ModifyListModal from '@/modals/ModifyListModal'
import {
  type TodoListList,
  useTodoListContext
} from '@/providers/TodoListProvider'

function TaskListListItem({ item }: { item: TodoListList }) {
  const { filter, setFilter } = useTodoListContext()
  const { open } = useModalStore()

  const handleUpdateList = useCallback(() => {
    open(ModifyListModal, {
      type: 'update',
      initialData: item
    })
  }, [item])

  const deleteMutation = useForgeMutation(
    forgeAPI.lists.remove.input({ id: item.id }),
    {
      action: 'delete',
      queryKey: forgeAPI.key,
      onSuccess: () => {
        if (filter.list === item.id) {
          setFilter('list', null)
        }
      }
    }
  )

  const handleDeleteList = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete List',
      description: 'Are you sure you want to delete this list?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }, [item])

  return (
    <SidebarItem
      active={filter.list === item.id}
      contextMenuItems={
        <>
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={handleUpdateList}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={handleDeleteList}
          />
        </>
      }
      icon={item.icon}
      label={item.name}
      namespace={false}
      number={item.amount}
      sideStripColor={item.color}
      onCancelButtonClick={() => {
        setFilter('list', null)
      }}
      onClick={() => {
        setFilter('list', item.id)
      }}
    />
  )
}

export default TaskListListItem
