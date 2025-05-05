import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

import { MenuItem, SidebarItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { type ITodoListList } from '../../../interfaces/todo_list_interfaces'

function TaskListListItem({
  item,
  setSidebarOpen
}: {
  item: ITodoListList
  setSidebarOpen: (value: boolean) => void
}) {
  const open = useModalStore(state => state.open)
  const [searchParams, setSearchParams] = useSearchParams()

  const handleUpdateList = useCallback(() => {
    open('todoList.modifyList', {
      type: 'update',
      existedData: item
    })
  }, [item])

  const handleDeleteList = useCallback(() => {
    open('deleteConfirmation', {
      apiEndpoint: 'todo-list/lists',
      confirmationText: 'Delete this list',
      customText:
        'Are you sure you want to delete this list? The tasks inside this list will not be deleted.',
      data: item,
      itemName: 'list',
      queryKey: ['todo-list', 'lists']
    })
  }, [item])

  return (
    <SidebarItem
      active={searchParams.get('list') === item.id}
      hamburgerMenuItems={
        <>
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={handleUpdateList}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={handleDeleteList}
          />
        </>
      }
      icon={item.icon}
      name={item.name}
      number={item.amount}
      sideStripColor={item.color}
      onCancelButtonClick={() => {
        searchParams.delete('list')
        setSearchParams(searchParams)
        setSidebarOpen(false)
      }}
      onClick={() => {
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          list: item.id
        })
        setSidebarOpen(false)
      }}
    />
  )
}

export default TaskListListItem
