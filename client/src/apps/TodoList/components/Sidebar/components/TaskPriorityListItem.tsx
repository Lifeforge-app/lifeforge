import {
  DeleteConfirmationModal,
  MenuItem,
  SidebarItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

import ModifyPriorityModal from '@apps/TodoList/modals/ModifyPriorityModal'
import type { TodoListPriority } from '@apps/TodoList/providers/TodoListProvider'

function TaskPriorityListItem({
  item,
  setSidebarOpen
}: {
  item: TodoListPriority
  setSidebarOpen: (value: boolean) => void
}) {
  const open = useModalStore(state => state.open)

  const [searchParams, setSearchParams] = useSearchParams()

  const handleUpdatePriority = useCallback(() => {
    open(ModifyPriorityModal, {
      type: 'update',
      initialData: item
    })
  }, [item])

  const handleDeletePriority = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'todo-list/priorities',
      confirmationText: 'Delete this priority',
      customText:
        'Are you sure you want to delete this priority? The tasks with this priority will not be deleted.',
      data: item,
      itemName: 'priority',
      queryKey: ['todo-list', 'priorities']
    })
  }, [item])

  return (
    <SidebarItem
      active={searchParams.get('priority') === item.id}
      hamburgerMenuItems={
        <>
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={handleUpdatePriority}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={handleDeletePriority}
          />
        </>
      }
      name={item.name}
      number={item.amount}
      sideStripColor={item.color}
      onCancelButtonClick={() => {
        searchParams.delete('priority')
        setSearchParams(searchParams)
        setSidebarOpen(false)
      }}
      onClick={() => {
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          priority: item.id
        })
        setSidebarOpen(false)
      }}
    />
  )
}

export default TaskPriorityListItem
