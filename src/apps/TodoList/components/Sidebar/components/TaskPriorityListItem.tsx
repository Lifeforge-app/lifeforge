import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'
import { useSearchParams } from 'react-router'

import { MenuItem, SidebarItem } from '@lifeforge/ui'

import { type ITodoPriority } from '../../../interfaces/todo_list_interfaces'

function TaskPriorityListItem({
  item,
  setSidebarOpen
}: {
  item: ITodoPriority
  setSidebarOpen: (value: boolean) => void
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    setSelectedPriority: setSelectedData,
    setModifyPriorityModalOpenType: setModifyModalOpenType,
    setDeletePriorityConfirmationModalOpen: setDeleteConfirmationModalOpen
  } = useTodoListContext()

  return (
    <SidebarItem
      active={searchParams.get('priority') === item.id}
      hamburgerMenuItems={
        <>
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={e => {
              e.stopPropagation()
              setSelectedData(item)
              setModifyModalOpenType('update')
            }}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={e => {
              e.stopPropagation()
              setSelectedData(item)
              setDeleteConfirmationModalOpen(true)
            }}
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
