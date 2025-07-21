import { DeleteConfirmationModal, MenuItem, SidebarItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

import {
  ISchemaWithPB,
  TodoListCollectionsSchemas
} from 'shared/types/collections'

import ModifyListModal from '@apps/TodoList/modals/ModifyListModal'

function TaskListListItem({
  item,
  setSidebarOpen
}: {
  item: ISchemaWithPB<TodoListCollectionsSchemas.IListAggregated>
  setSidebarOpen: (value: boolean) => void
}) {
  const open = useModalStore(state => state.open)

  const [searchParams, setSearchParams] = useSearchParams()

  const handleUpdateList = useCallback(() => {
    open(ModifyListModal, {
      type: 'update',
      existedData: item
    })
  }, [item])

  const handleDeleteList = useCallback(() => {
    open(DeleteConfirmationModal, {
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
